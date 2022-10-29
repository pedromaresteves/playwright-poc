// playwright-dev-page.js
const { expect } = require('@playwright/test');

exports.TodoMVCPage = class TodoMVC {

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.newTodoInput = page.locator('.new-todo');
    this.itemParent = page.locator('[data-testid="todo-item"]');
    this.editSelector = '.edit';
    this.deleteSelector = '.destroy';
  }

  async goto() {
    await this.page.goto('https://demo.playwright.dev/todomvc');
    await expect(this.page).toHaveTitle(/React • TodoMVC/);
  };

  async addNewTodoItem(itemContent) {
    await this.newTodoInput.click();
    await this.newTodoInput.fill(itemContent);
    await this.page.keyboard.press('Enter');
  }

  async editTodoItem(itemContent, index) {
    await this.itemParent.nth(index).dblclick();
    await this.itemParent.nth(index).locator(this.editSelector).fill(itemContent);
    await this.page.keyboard.press('Enter');
  }

  async deleteTodoItem(index) {
    await this.itemParent.nth(index).hover();
    await this.itemParent.nth(index).locator(this.deleteSelector).click()
  }
}