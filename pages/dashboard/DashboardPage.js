const { BasePage } = require('../base/BasePage')
const { expect } = require('@playwright/test')
import { generateAssociateName } from '../../utils/data-generator'
const path = require('path')

class DashboardPage extends BasePage {
  constructor(page) {
    super(page)
    this.url = '.'
    this.emailInputField = page.getByRole('textbox', { name: 'Email' })
    this.issueTypeDropdown = page.getByRole('combobox', {
      name: /type of support request/i,
    })

    this.uploadIcon = page.locator('input[type="file"]')
    this.whatWeCanHelpWithInputField = page.getByRole('textbox', {
      name: 'What can we help with?',
    })
    this.submitButton = page.getByRole('button', { name: 'Submit' })
    this.submissionHeading = page.getByRole('heading', {
      name: 'Submission Received',
    })
    this.submissionText = page.getByText('Thank you for your submission!')
    this.submissionEmailText = page.getByText("We'll be in touch via email")
    this.submitAnotherButton = page.getByRole('button', {
      name: 'Submit Another Request',
    })
  }

  async open() {
    await this.navigate(this.url)
  }

  async fillSupportFormWithoutUploadForBugRelatedIssues() {
    await this.page.setViewportSize({ width: 1920, height: 624 })

    this.associateName = generateAssociateName()

    await this.emailInputField.fill(this.associateName + '@kinship.com')

    await this.issueTypeDropdown.click()

    await this.issueTypeDropdown.fill('Bug')
    await this.issueTypeDropdown.press('Enter')

    //For upload in debug
    // const filePath = path.resolve(
    //   __dirname,
    //   '../../tests/fixtures/test-image.jpeg',
    // )

    // await this.uploadIcon.setInputFiles(filePath)

    await this.whatWeCanHelpWithInputField.fill(
      'This is an automated test issue description - testing text without upload, please ignore ⚠️ © Ayo.',
    )
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (resp) =>
          resp.request().method() === 'POST' && resp.url().includes('/support'),
      ),
      this.submitButton.click(),
    ])

    expect(response.status()).toBe(200)
    // await this.submitButton.click()
    await expect(this.submissionHeading).toBeVisible()
    await expect(this.submissionText).toBeVisible()
    await expect(this.submissionEmailText).toBeVisible()
    await expect(this.submitAnotherButton).toBeVisible()

    console.log(
      'Support form successfully submitted and confirmation view displayed.',
    )
    console.log('Support form submitted without upload for bug-related issues.')
  }
}

module.exports = { DashboardPage }
