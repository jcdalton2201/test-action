# Contributing to SV

Here are the guidelines we'd like you to follow to Contribute to Squid:
 - [Code of Conduct](#coc)
 - [Question or Problem?](#question)
 - [Issues and Bugs](#issue)
 - [Feature Requests](#feature)
 - [Submission Guidelines](#submit)
 - [Coding Rules](#rules)
 - [Documentation](#documentation)
 - [Commit Message Guidelines](#commit)

 ## <a name="coc"></a> Code of Conduct

 
## <a name="question"></a> Got a Question or Problem?

If you have a question about how to use Squid please direct your questions to the issues section of github, or contact your tech lead to get a hold of someone that would have the answers.

## <a name="issue"></a> Found an Issue?

If you find a bug in the source code or a mistake in the documentation, you can help us by
submitting an issue to our [GitHub Repository][github]. Even better you can submit a Pull Request
with a fix.
**Please see the [Submission Guidelines](#submit) below.**

## <a name="feature"></a> Want a Feature?

You can request a new feature by submitting an issue to our [GitHub Repository][github].  If you
would like to implement a new feature then consider what kind of change it is:

* **Major Changes** that you wish to contribute to the project should be discussed first on our
  [GitHub Repository][github] as a feature request, so that we can better coordinate our efforts,
  prevent duplication of work, and help you to craft the change so that it is successfully accepted
  into the project.
* **Small Changes** can be crafted and submitted to the [GitHub Repository][github] as a Pull
  Request.

## <a name="submit"></a> Submission Guidelines

### Submitting an Issue
Before you submit your issue search the archive, maybe your question was already answered.

If your issue appears to be a bug, and hasn't been reported, open a new issue. Help us to maximize
the effort we can spend fixing issues and adding new features, by not reporting duplicate issues.
Providing the following information will increase the chances of your issue being dealt with
quickly:

* **Overview of the Issue** - if an error is being thrown a non-minified stack trace helps
* **Motivation for or Use Case** - explain why this is a bug for you
* **Squid Version(s)** - is it a regression?
* **Browsers and Operating System** - is this a problem with all browsers or only specific ones?
* **Related Issues** - has a similar issue been reported before?
* **Suggest a Fix** - if you can't fix the bug yourself, perhaps you can point to what might be
causing the problem (line of code or commit)


**If you get help, help others. Good karma rulez!**

### Submitting a Pull Request
Before you submit your pull request consider the following guidelines:

* Search [GitHub](https://github.com/fed-libraries/squid/pulls) for an open or closed Pull Request
that relates to your submission. You don't want to duplicate effort.
* Please refer to our [Code Standards](CODESTANDARDS.md)
* Make your changes in your fork version of the repo on the dev branch:
* Create your patch, **including appropriate test cases**.
* Run the full Squid test suite, using
`npm test`
and ensure that all tests pass.
* Build your changes locally to ensure all the tests pass:

```bash
npm run build
```

* Commit your changes using a descriptive commit message that follows our
[commit message conventions](#commit).
Adherence to the [commit message conventions](#commit) is required,
because release notes are automatically generated from these messages.

```bash
git commit -a
```
Note: the optional commit `-a` command line option will automatically "add" and "rm" edited files.

* Push your branch to GitHub:

```bash
git push origin dev
```

In GitHub, send a pull request to `Squid:master`.
If we suggest changes, then:

* Make the required updates.
* Re-run the Squid test suite to ensure tests are still passing.
* Commit your changes to your branch (e.g. `dev`).
* Push the changes to your GitHub repository (this will update your Pull Request).

If the PR gets too outdated we may ask you to rebase and force push to update the PR:

```bash
git rebase master -i
git push origin dev -f
```

_WARNING: Squashing or reverting commits and force-pushing thereafter may remove GitHub comments
on code that were previously made by you or others in your commits. Avoid any form of rebasing
unless necessary._

That's it! Thank you for your contribution!

#### After your pull request is merged

After your pull request is merged, you can safely delete your branch and pull the changes
from the main (upstream) repository:

* Check out the master branch:

```shell
git checkout dev -f
```

*
* Update your master with the latest upstream version:

```shell
git pull --ff upstream dev
```
## <a name="commit"></a> Git Commit Guidelines

We have very precise rules over how our git commit messages can be formatted.  This leads to **more
readable messages** that are easy to follow when looking through the **project history**.  But also,
we use the git commit messages to **generate the Digital Data App change log**.

The commit message formatting can be added using a typical git workflow or through the use of a CLI
wizard ([Commitizen](https://github.com/commitizen/cz-cli)).

### Commit Message Format
Each commit message consists of a **header**, a **body** and a **footer**.  The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

*patches:*
```
git commit -a -m "fix(parsing): fixed a bug in our parser"
```
*features:*
```
git commit -a -m "feat(parser): we now have a parser \o/"
```
*breaking changes:*
```
git commit -a -m "feat(new-parser): introduces a new parsing library
BREAKING CHANGE: new library does not support foo-construct"
```

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

### Revert
If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit.
In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### Type
Must be one of the following:

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing
  semi-colons, etc)
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **perf**: A code change that improves performance
* **test**: Adding missing or correcting existing tests
* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation
  generation

### Scope
The scope could be anything specifying place of the commit change. For example `routes`,
`mock`, `helpers`, etc...

You can use `*` when the change affects more than a single scope.

### Subject
The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

### Body
Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer
The footer should contain any information about **Breaking Changes** and is also the place to
[reference GitHub issues that this commit closes][closing-issues].

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines.
The rest of the commit message is then used for this.
[github]: https://github.com/fed-libraries/squid

## <a name="documentation"></a> Documentation

Creating your documentation for git pages is simple.

Create a template page in the template directory inside the docs folder.  Name this file the same as the link name
you are going to use to map to it.

Example 
###squid-button

```
<a href="javascript:clickChangeMain('squid-button')">
  <span>Buttons</span>
</a>
```
we would name the file squid-button.html

Copy the content from template.html into your html page.

replace the {{}} text with your tags.

Between the template-code-section tags place example code.
  Between the preview tags is your code examples in the browsers
  Between the example tag is your visual examples of your code.
Between the template-code-usage tags place design usage text.
