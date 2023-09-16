import { createDefu } from 'defu'

const DEFAULT_CONFIG = {
	types: [
		{ type: 'feat', section: '🚀 Enhancements' },
		{ type: 'perf', section: '🔥 Performance' },
		{ type: 'fix', section: '🩹 Fixes' },
		{ type: 'refactor', section: '💅 Refactors' },
		{ type: 'docs', section: '📖 Documentation' },
		{ type: 'build', section: '📦 Build' },
		{ type: 'types', section: '🌊 Types' },
		{ type: 'chore', section: '🏡 Chore' },
		{ type: 'examples', section: '🏀 Examples' },
		{ type: 'test', section: '✅ Tests' },
		{ type: 'style', section: '🎨 Styles' },
		{ type: 'ci', section: '🤖 CI' },
	],
	issueUrlFormat: '{{host}}/{{owner}}/{{repository}}/issues/{{id}}',
	commitUrlFormat: '{{host}}/{{owner}}/{{repository}}/commit/{{hash}}',
	compareUrlFormat: '{{host}}/{{owner}}/{{repository}}/compare/{{previousTag}}...{{currentTag}}',
	userUrlFormat: '{{host}}/{{user}}',
	issuePrefixes: ['#'],
	breakingChangesTitle: '⚠️ Breaking Changes',
	contributorsTitle: '❤️ Contributors',
	compareLinkTitle: 'compare changes',
}

const _defu = createDefu((obj, key, value, namespace) => {
	if (
		(namespace === '.' && key === 'issuePrefixes')
		|| (namespace === '.' && key === 'types')
	) {
		obj[key] = value
		return true
	}
})

export function resolveConfig(config) {
	return _defu(config ?? {}, DEFAULT_CONFIG)
}
