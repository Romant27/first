import {test,expect} from '@playwright/test'

test.beforeEach(async({page})=>{
 await page.goto('http://localhost:4200/')
})
test('select field', async ({ page }) => {
await page.getByText('Forms').click()
await page.getByText('Form Layouts').click()
await page.getByPlaceholder('jane Doe').pressSequentially('Doe')
await page.locator('[class="inline-form-card"]').getByPlaceholder('Email').pressSequentially('test@test')
//await page.locator('[class="inline-form-card"]').getByRole('checkbox').check({force:true})
await expect(page.locator('[class="inline-form-card"]').getByPlaceholder('Email')).toHaveValue('test@test')
await expect(page.locator('[class="inline-form-card"]').getByRole('checkbox')).not.toBeChecked()
})


// test ('drop repeat', async({page})=>{
//  await page.getByRole("button",{name:"Light"}).click()
//  await page.getByText('Dark').click()
// })
test ('drop repeat', async({page})=>{
 await page.getByText('Light').first().click()
 await page.getByText('Dark').click()
 //await expect(page.locator('nb-layout-header')).toHaveCSS('backgroundcolor', 'rgb(34, 43, 69)') 
 await expect(page.locator('nb-layout-header')).toHaveCSS('background-color', 'rgb(34, 43, 69)')  
})

test ('off text', async({page})=>{
 await page.getByText('Roller Shades').click()
 const offbutton = await page.locator('[ng-reflect-title="Roller Shades"] [class="status paragraph-2"]')
 await expect(offbutton).toHaveText('OFF')
})

test ('tooltyp without listener', async({page})=>{
 await page.getByText('Modal & Overlays').click()
 await page.locator('[title="Toastr"]').click()
 await page.locator('[name="content"]').clear()
 const Content= 'New text here'
 await page.locator('[name="content"]').fill(Content)
 await page.locator('[class="position-select appearance-outline size-medium status-basic shape-rectangle nb-transition"]').click()
 await page.getByText('top-left').click()
 await page.locator('[class="appearance-outline size-medium status-basic shape-rectangle nb-transition"]').click()
 await page.getByText('warning').click()
 await page.getByRole('button',{name:'show toast'}).click()
 await expect(page.locator('nb-toastr-container [class="message"]')).toContainText(Content)
 await page.waitForTimeout(400)
 await expect(page.locator('nb-toast'))
  .toHaveCSS('background-color', 'rgb(255, 170, 0)')
  await expect(page.locator('nb-toast'))
  .toHaveClass(/status-warning/)

})

test ('with listener', async({page})=>{
 await page.getByText('Tables & Data').click()
 await page.getByText('Smart Table').click()
 const firstRow = page.locator('tbody tr').first()
 const deletedEmail = await firstRow.locator('td').nth(4).textContent()

  page.on('dialog',dialog=> {
     //expect(dialog.message()).toContain('Are you sure ')
     dialog.accept()
  })
 await page.locator('ng2-st-tbody-edit-delete .nb-trash').first().click()
 await expect(firstRow).not.toContainText(deletedEmail!)
 
})

test ('fill table', async({page})=>{
  await page.getByText('Tables & Data').click()
  await page.getByText('Smart Table').click()

  await page.locator('.ng2-smart-action-add-add').click()

  // QA-style генераторы (вариант 3)
  const randomString = (len: number) =>                     
    Math.random().toString(36).substring(2, 2 + len)        //const rstr = (len:number)=>math.random(.tostring(36).substring(2,2+len))

  const randomNumber = (min: number, max: number) => 
    Math.round(Math.random() * (max - min) + min) 

  const testData = {
    id: randomNumber(1, 1000),
    firstName: randomString(6),
    lastName: randomString(8),
    userName: randomString(7),
    email: `${randomString(6)}@test.com`,
    age: randomNumber(18, 65),
  }

  await page.getByPlaceholder('ID').nth(1).fill(String(testData.id))
  await page.getByPlaceholder('First Name').nth(1).fill(testData.firstName)
  await page.getByPlaceholder('Last Name').nth(1).fill(testData.lastName)
  await page.getByPlaceholder('Username').nth(1).fill(testData.userName)
  await page.getByPlaceholder('E-mail').nth(1).fill(testData.email)
  await page.getByPlaceholder('Age').nth(1).fill(String(testData.age))

  await page.locator('.ng2-smart-action-add-create').click()

  await expect(page.locator('tbody')).toContainText(testData.email)
})
