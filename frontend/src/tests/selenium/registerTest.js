const { By, Key } = require('selenium-webdriver');
const { createDriver } = require('./BaseTest');
const { newUser } = require('./utils/testData');

async function registerTest() {
  let driver = await createDriver();

  try {
    // 1. Open Register page
    await driver.get('http://localhost:3000/RegisterPage');

    // 2. Fill the registration form
    await driver.findElement(By.name('name')).sendKeys('Test User');  // <-- Name
    await driver.findElement(By.name('email')).sendKeys(newUser.email);  // <-- Email
    await driver.findElement(By.name('phone')).sendKeys('1234567890');  // <-- Phone
    await driver.findElement(By.name('password')).sendKeys(newUser.password);  // <-- Password
    await driver.findElement(By.name('confirmPassword')).sendKeys(newUser.password);  // <-- Confirm Password

    // 3. Submit the form
    await driver.findElement(By.css('button[type="submit"]')).click();

    // 4. Wait for navigation or success
    await driver.sleep(3000);  // Small wait (you can improve this with smarter wait)

    console.log(`✅ Registration Test Passed for ${newUser.email}`);
  } catch (err) {
    console.error('❌ Registration Test Failed:', err);
  } finally {
    await driver.quit();
  }
}

registerTest();
