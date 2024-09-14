import { writeChangelogString } from 'conventional-changelog-writer'
import { describe, expect, it } from 'vitest'
import { resolveConfig } from './config.mjs'
import { createWriterOpts } from './writer.mjs'

const COMMITS = [
	{
		hash: '9b1aff905b638aa274a5fc8f88662df446d374bd',
		shortHash: '9b1aff9',
		type: 'feat',
		scope: 'scope',
		subject: 'broadcast $destroy event on scope destruction',
		header: 'feat(scope): broadcast $destroy event on scope destruction',
		body: null,
		footer: 'Closes #1',
		notes: [],
		references: [],
		authorName: 'mark',
		authorEmail: 'mark@example.com',
	},
	{
		hash: '13f31602f396bc269076ab4d389cfd8ca94b20ba',
		shortHash: '13f3160',
		type: 'fix',
		scope: 'ng-list',
		subject: 'Allow custom separator',
		header: 'fix(ng-list)!: Allow custom separator',
		body: 'bla bla bla',
		footer: 'BREAKING CHANGE: some breaking change',
		notes: [{
			title: 'BREAKING CHANGE',
			text: 'some breaking change',
		}],
		references: [],
		authorName: 'elroy',
		authorEmail: 'elroy@yaya.io',
	},
	{
		hash: 'bf7389d4248157f7ab59cdb4d4a5a62b71971db5',
		shortHash: 'bf7389d',
		type: 'feat',
		scope: '',
		subject: 'test 1234',
		header: 'feat: test 1234',
		body: null,
		footer: null,
		notes: [],
		references: [],
		authorName: 'elroy',
		authorEmail: 'elroy@yaya.io',
	},
	{
		hash: '2064a9346c550c9b5dbd17eee7f0b7dd2cde9cf7',
		shortHash: '2064a93',
		type: 'perf',
		scope: 'template',
		subject: 'tweak',
		header: 'perf(template): tweak',
		body: 'My body.',
		footer: '',
		notes: [],
		references: [],
		authorName: 'mark',
		authorEmail: 'mark@gg.gg',
	},
	{
		hash: '5f241416b79994096527d319395f654a8972591a',
		shortHash: '5f24141',
		type: 'refactor',
		scope: 'name',
		subject: 'rename this module to conventional-changelog-writer',
		header: 'refactor(name): rename this module to conventional-changelog-writer',
		body: '',
		footer: '',
		notes: [],
		references: [],
		authorName: 'mark',
		authorEmail: 'mark@example.com',
	},
]

describe('writer', () => {
	it('should print correct content', async () => {
		const context = {
			version: '0.5.0',
			title: 'this is a title',
			host: 'https://github.com',
			owner: 'a',
			repository: 'b',
			linkCompare: true,
			previousTag: 'v0.4.0',
			currentTag: 'v0.5.0',
		}
		const options = await createWriterOpts(resolveConfig())
		const changelog = await writeChangelogString(COMMITS, context, options)

		expect(changelog).toContain('## v0.5.0')
		expect(changelog).toContain('### 🚀 Enhancements')
		expect(changelog).toContain('### 🔥 Performance')
		expect(changelog).toContain('### 🩹 Fixes')
		expect(changelog).toContain('### 💅 Refactors')
		expect(changelog).toContain('### ⚠️ Breaking Changes')
		expect(changelog).toContain('#### ❤️ Contributors')
	})
})
