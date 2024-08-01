import { readFile } from 'node:fs/promises'
import { URL, fileURLToPath } from 'node:url'
import { upperFirst } from 'scule'
import compareFunc from 'compare-func'
import { checkBreakingChangeNote, hasBreakingChange } from './parser.mjs'

const BASE_DIR = import.meta.url

export async function createWriterOpts(
	config,
) {
	return {
		...await createTemplates(config),
		groupBy: 'type',
		commitGroupsSort: createCommitGroupsSortFn(config),
		commitsSort: ['scope', 'subject'],
		noteGroupsSort: 'title',
		notesSort: compareFunc(),
		transform: createTransformFn(config),
		finalizeContext: createFinalizeContextFn(config),
	}
}

function createTransformFn(
	config,
) {
	const getTypeEntry = (commit) => {
		const key = (commit.revert ? 'revert' : (commit.type || '')).toLowerCase()
		return config.types.find((entry) => {
			if (entry.type !== key)
				return false

			if (entry.scope && entry.scope !== commit.scope)
				return false

			return true
		})
	}

	const patchType = (commit) => {
		const entry = getTypeEntry(commit)
		if (entry)
			commit.type = entry.section
	}

	const patchScope = (commit) => {
		if (commit.scope === '*')
			commit.scope = null
	}

	const patchTitle = (commit) => {
		const pair = typeof commit.subject === 'string'
			? [commit.subject, 'subject']
			: typeof commit.header === 'string'
				? [commit.header, 'header']
				: null
		if (!pair)
			throw new Error('commit not have `subject`, `header` sections')

		const [content, key] = pair

		let formated = content
		formated = upperFirst(formated)

		if (hasBreakingChange(commit))
			formated = `⚠️ ${formated}`

		commit[key] = formated
	}

	return (commit) => {
		const _commit = { ...commit }

		patchType(_commit)
		patchScope(_commit)
		patchTitle(_commit)

		return _commit
	}
}

function createFinalizeContextFn(
	config,
) {
	const createContributors = (commits) => {
		const authors = Object.entries(
			commits.reduce((obj, commit) => {
				const { authorEmail, authorName } = commit.raw
				if (authorEmail && authorName) {
					obj[authorName] ??= new Set()
					obj[authorName].add(authorEmail)
				}
				return obj
			}, {}),
		)

		return authors.length
			? authors.map(([name, emails]) => ({
				name: upperFirst(name),
				email: pickEmail(emails),
			}))
			: null
	}

	const createBreakingChanges = (commits) => {
		const result = commits
			.filter(commit => hasBreakingChange(commit.raw))
			.map(commit => commit.raw)

		return result.length
			? result
			: null
	}

	const patchTanslates = (context) => {
		context.breakingChangesTitle = config.breakingChangesTitle
		context.contributorsTitle = config.contributorsTitle
		context.compareLinkTitle = config.compareLinkTitle
	}

	const patchNoteGroupsBreakingChanges = (context) => {
		context.noteGroups = context.noteGroups
			.filter(note => !checkBreakingChangeNote(note))
	}

	const patchLinkCompare = (context) => {
		if (typeof context.linkCompare !== 'boolean' && context.previousTag && context.currentTag) {
			context.linkCompare = true
		}
	}

	return (
		context,
		options,
		commits,
		keyCommit,
	) => {
		context.contributors = createContributors(commits)
		context.breakingChanges = createBreakingChanges(commits)

		patchTanslates(context)
		patchNoteGroupsBreakingChanges(context)
		patchLinkCompare(context)

		return context
	}
}

function createCommitGroupsSortFn(config) {
	const indexMap = config.types
		.flatMap(t => t.section)
		.filter(Boolean)
		.reduce((obj, section, index) => {
			obj[section] = index
			return obj
		}, {})

	return (a, b) => indexMap[a.title || ''] - indexMap[b.title || '']
}

async function createTemplates(config) {
	const owner = '{{#if this.owner}}{{~this.owner}}{{else}}{{~@root.owner}}{{/if}}'
	const host = '{{~@root.host}}'
	const repository = '{{#if this.repository}}{{~this.repository}}{{else}}{{~@root.repository}}{{/if}}'

	const commitUrlFormat = expandTemplate(config.commitUrlFormat, {
		host,
		owner,
		repository,
	})
	const compareUrlFormat = expandTemplate(config.compareUrlFormat, {
		host,
		owner,
		repository,
	})
	const issueUrlFormat = expandTemplate(config.issueUrlFormat, {
		host,
		owner,
		repository,
		id: '{{this.issue}}',
		prefix: '{{this.prefix}}',
	})

	const [
		template,
		header,
		commit,
		footer,
	] = await Promise.all([
		readFile(fileURLToPath(new URL('./templates/template.hbs', BASE_DIR)), 'utf-8'),
		readFile(fileURLToPath(new URL('./templates/header.hbs', BASE_DIR)), 'utf-8'),
		readFile(fileURLToPath(new URL('./templates/commit.hbs', BASE_DIR)), 'utf-8'),
		readFile(fileURLToPath(new URL('./templates/footer.hbs', BASE_DIR)), 'utf-8'),
	])

	return {
		mainTemplate: template,
		headerPartial: header
			.replace(/{{compareUrlFormat}}/g, compareUrlFormat),
		commitPartial: commit
			.replace(/{{commitUrlFormat}}/g, commitUrlFormat)
			.replace(/{{issueUrlFormat}}/g, issueUrlFormat),
		footerPartial: footer,
	}
}

function pickEmail(
	emails,
) {
	return [...emails].find(e => !e.includes('noreply.github.com'))
}

function expandTemplate(template, context) {
	let expanded = template
	Object.keys(context).forEach((key) => {
		expanded = expanded.replace(new RegExp(`{{${key}}}`, 'g'), context[key])
	})
	return expanded
}
