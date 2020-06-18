// Adds the task in cypress and returns an index to use for editing and replying to the task
async function addTask(text) {
  cy.get(`[data-cy=discuss-input-add]`).click()

  cy.contains('.DraftEditor-root', 'Describe what')
    .should(($e) => {
      expect($e.find('.public-DraftEditor-content')).to.have.prop('contenteditable', 'true')
    })
    .type(text)
    .type('{enter}')
    .should('have.text', text)
}

function editTask(text: string, oldContent: string) {
  cy.contains('.DraftEditor-root', oldContent)
    .type('{selectall}')
    .type('{backspace}')
    .type(text)
    .type('{enter}')
    .should('have.text', text)
}

function replyComment(text: string, taskContent: string) {
  cy.contains('.DraftEditor-root', taskContent)
    .parents(`[data-cy=task-wrapper]`)
    .as('task-to-reply')

  cy.get('@task-to-reply')
    .find(`[data-cy=task-reply-button]`)
    .click()

  cy.get(`[data-cy=task-reply-input-editor]`)
    .click()
    .type(`${text}`)
    .should('have.text', `${text}`)

  cy.get(`[data-cy=task-reply-input-send]`).click()

  cy.get('@task-to-reply')
    .children()
    .children()
    .last()
    .get(`[data-cy=child-comment-editor]`)
    .should('have.text', `${text}`)
}

function replyTask(text: string, taskContent: string) {
  cy.contains('.DraftEditor-root', taskContent)
    .parents(`[data-cy=task-wrapper]`)
    .as('task-to-reply')

  cy.get('@task-to-reply')
    .find(`[data-cy=task-reply-button]`)
    .click()

  cy.get('@task-to-reply')
    .find(`[data-cy=task-reply-input-add]`)
    .click()

  cy.get('@task-to-reply')
    .children()
    .children()
    .last()
    .get(`[data-cy=child-task-card-editor]`)
    .as('reply-card-editor')

  cy.get('@reply-card-editor').should('be.visible')

  cy.get('@reply-card-editor').type(`${text}`)

  cy.get('@reply-card-editor').should('have.text', `${text}`)

  cy.get('@reply-card-editor').type('{enter}')

  cy.get('@reply-card-editor').should('have.text', `${text}`)
}

function addComment(text) {
  cy.get('[data-cy=discuss-input-editor]')
    .type(`${text}`)
    .should('have.text', `${text}`)

  cy.get('[data-cy=discuss-input-editor]').type('{enter}')

  cy.get(`[data-cy=discuss-thread-list]`)
    .children()
    .last()
    .as('add-discuss-comment')

  cy.get('@add-discuss-comment')
    .find(`[data-cy=comment-editor]`)
    .should('have.text', `${text}`)
}

function editComment(text: string, oldContent: string) {
  cy.contains('.DraftEditor-root', oldContent)
    .parents(`[data-cy=comment-wrapper]`)
    .as('comment-to-edit')

  cy.get('@comment-to-edit')
    .find(`[data-cy=comment-editor]`)
    .as('edit-discuss-comment')

  cy.get('@comment-to-edit')
    .find(`[data-cy=comment-dropdown-menu]`)
    .click()

  cy.get(`[data-cy='edit-comment']`).click()

  cy.get('@edit-discuss-comment')
    .type('{selectall}')
    .type('{backspace}')
    .type(`${text}`)
    .should('have.text', `${text}`)

  cy.get('@edit-discuss-comment').type('{enter}')

  cy.get('@edit-discuss-comment').should('have.text', text)
}

function deleteComment(text: string) {
  cy.contains('.DraftEditor-root', text)
    .parents(`[data-cy=comment-wrapper]`)
    .as('comment-to-delete')

  cy.get('@comment-to-delete')
    .find(`[data-cy=comment-dropdown-menu]`)
    .click()

  cy.get(`[data-cy=delete-comment]`).click()
}

function publishToJira(text: string) {
  cy.contains('.DraftEditor-root', text)
    .parents(`[data-cy=task-wrapper]`)
    .as('task-to-publish')

  cy.get('@task-to-publish')
    .find(`[data-cy=task-card-integration-button]`)
    .click()

  cy.get(`[data-cy=jira-integration]`).click()

  cy.get('@task-to-publish')
    .find(`[data-cy=task-card-jira-issue-link]`)
    .should('include.text', 'Issue')
}

function goToPreviousTopic(idx) {
  cy.get('[data-cy=topbar-toggle]').click()
  cy.get('[data-cy=discussion-section')
    .find(`[data-cy=discuss-item-${idx}]`)
    .click()
  cy.get('[data-cy=sidebar-toggle]').click()
}


describe('Test Discuss page Demo', () => {
  before(function () {
    // runs before all tests in the block
    cy.visitReflect()
      .visitPhase('group')
      .visitPhase('vote')
      .visitPhase('discuss', '/1')

    cy.wait(1000)

  })

  it('can create a new task', () => {
    cy.viewport(1280, 720)
    addTask('Have more one on ones instead of group meetings')
    cy.screenshot('create-discuss-task')
  })

  it('can edit a created task', () => {
    editTask('Have more 1-on-1s instead of group meetings', 'Have more one on ones instead of group meetings')
  })

  it('can reply to a created task', () => {
    cy.viewport(1280, 720)
    replyComment('This is a great idea!', 'Have more 1-on-1s instead of group meetings')
    cy.screenshot('reply-comment-discuss-task')

  })

  it('can reply to a created task with a task', () => {
    cy.viewport(1280, 720)
    replyTask('Incorporate a stopwatch into meetings', 'Have more 1-on-1s instead of group meetings')
    cy.screenshot('reply-task-discuss-task')

  })

  it('can create a new comment in discussion board', () => {
    cy.viewport(1280, 720)
    addComment('We should have meetings every other day.')
    cy.screenshot('create-discuss-comment')

  })

  it('can edit a created comment in discussion board', () => {
    editComment('We should have meetings once a week.', 'We should have meetings every other day.')
  })

  it('can delete a created comment in discussion board', () => {
    deleteComment('We should have meetings once a week.')
  })

  it('can "publish" a task to "JIRA" (this is simulated)', () => {
    cy.viewport(1280, 720)

    addTask('Design a system to limit unnecessary meetings')

    publishToJira('Design a system to limit unnecessary meetings')

    cy.screenshot('publish-to-jira')

  })

  it('can advance to a new discussion item', () => {
    cy.get(`[data-cy=next-phase]`).dblclick()
    cy.get(`[data-cy=next-phase]`).dblclick()
  })

  it('can navigate back to a previous item', () => {
    goToPreviousTopic(1)
  })

  it('can still add a new task', () => {
    addTask('Intern progress meetings')
  })

  it('can end meeting', () => {
    cy.get('[data-cy=end-button').dblclick()
  })

  it('can see a meeting summary', () => {
    cy.url().should('include', '/retrospective-demo-summary')
    cy.get('[data-cy=create-account-section').then(($el) => {
      $el.hide()
    })
    cy.viewport(1280, 720)
    cy.screenshot('meeting-summary')

  })

  it('can click CTA', () => {
    cy.get('[data-cy=create-account-section').then(($el) => {
      $el.show()
    })
    cy.get(`[data-cy=create-account]`)
      .should('be.visible')
      .click()
    cy.viewport(1280, 720)
    cy.screenshot('cta-screen')

  })

})
