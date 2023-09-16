export function createGitRawCommitsOpts(_config) {
	return {
		format: '%B%n-hash-%n%H%n-shortHash-%n%h%n-authorName-%n%an%n-authorEmail-%n%ae%n',
	}
}
