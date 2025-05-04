const { By, Key } = require('selenium-webdriver');
const { createDriver } = require('./BaseTest');
const { validUser } = require('./utils/testData');

async function forgotPasswordTest() {
  const driver = await createDriver();

  try {
    // 1. Open Forgot Password Page
    await driver.get('http://localhost:3000/ForgotPasswordPage'); // Adjust if your route is different

    // 2. Fill Forgot Password Form
    await driver.findElement(By.name('email')).sendKeys(validUser.email);
    await driver.findElement(By.name('newPassword')).sendKeys('newPassword123');
    await driver.findElement(By.name('confirmPassword')).sendKeys('newPassword123');

    // 3. Click Reset Password Button
    await driver.findElement(By.css('button[type="submit"]')).click();

    console.log(' Forgot Password Test: Form submitted successfully.');

    // 4. Small wait to see result
    await driver.sleep(5000);

  } catch (err) {
    console.error('❌ Forgot Password Test Failed:', err);
  } finally {
    await driver.quit();
  }
}

forgotPasswordTest();
