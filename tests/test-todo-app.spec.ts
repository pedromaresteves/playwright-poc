import { test, expect, type Page } from '@playwright/test';
import { TodoMVCPage } from '../page_objects/todoMVC.js';

test.beforeEach(async ({ page }) => {
  const todoMVCPage = new TodoMVCPage(page);
  await todoMVCPage.goto();
});


const TODO_ITEMS = [
  'buy some cheese',
  'feed the cat',
  'book a doctors appointment'
];

test.describe("adding items todo", () => {
  test('Should be able to add todo items and append to the end of the list', async ({ page }) => {
    const todoMVCPage = new TodoMVCPage(page);
    await todoMVCPage.addNewTodoItem(TODO_ITEMS[0])
    await expect(todoMVCPage.itemParent).toContainText('buy some cheese');
    await todoMVCPage.addNewTodoItem(TODO_ITEMS[1])
    await expect(todoMVCPage.itemParent.last()).toContainText('feed the cat');
    await todoMVCPage.addNewTodoItem(TODO_ITEMS[2])
    await expect(todoMVCPage.itemParent.last()).toContainText('book a doctors appointment');
  });

  test('Should clear text input field when an item is added', async ({ page }) => {
    const todoMVCPage = new TodoMVCPage(page);
    await todoMVCPage.addNewTodoItem(TODO_ITEMS[0]);
    await expect(todoMVCPage.newTodoInput).toBeEmpty();
  });

  test('Should be able to edit an item', async ({ page }) => {
    const todoMVCPage = new TodoMVCPage(page);
    await todoMVCPage.addNewTodoItem(TODO_ITEMS[0]);
    await todoMVCPage.addNewTodoItem(TODO_ITEMS[0]);
    await expect(todoMVCPage.itemParent.nth(1)).toContainText(TODO_ITEMS[0]);
    await todoMVCPage.editTodoItem('Edit item', 1);
    await expect(todoMVCPage.itemParent.nth(0)).toContainText(TODO_ITEMS[0]);
    await expect(todoMVCPage.itemParent.nth(1)).toContainText('Edit item');
  });

  test('Should be able to delete an item from the list', async ({ page }) => {
    const todoMVCPage = new TodoMVCPage(page);
    await todoMVCPage.addNewTodoItem(TODO_ITEMS[0]);
    await todoMVCPage.addNewTodoItem(TODO_ITEMS[1]);
    await todoMVCPage.addNewTodoItem(TODO_ITEMS[2]);
    await expect(todoMVCPage.itemParent.nth(0)).toContainText(TODO_ITEMS[0]);
    await expect(todoMVCPage.itemParent.nth(1)).toContainText(TODO_ITEMS[1]);
    await expect(todoMVCPage.itemParent.nth(2)).toContainText(TODO_ITEMS[2]);
    await todoMVCPage.deleteTodoItem(0);
    await expect(todoMVCPage.itemParent.nth(0)).toContainText(TODO_ITEMS[1]);
  });
});