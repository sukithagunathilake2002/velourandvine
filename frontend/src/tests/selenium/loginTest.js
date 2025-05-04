const { By, Key } = require('selenium-webdriver');
const { createDriver } = require('./BaseTest');
const { validUser } = require('./utils/testData');

async function loginTest() {
  let driver = await createDriver();

  try {
    await driver.get('http://localhost:3000/LoginPage');

    await driver.findElement(By.name('email')).sendKeys(validUser.email);
    await driver.findElement(By.name('password')).sendKeys(validUser.password, Key.RETURN);

    await driver.wait(
      async () => {
        const url = await driver.getCurrentUrl();
        return url.includes('/reserve') || url.endsWith('/');
      },
      10000,
      'Login navigation did not happen'
    );

    console.log('✅ Login Test Passed');
  } catch (err) {
    console.error('❌ Login Test Failed:', err);
  } finally {
    await driver.quit();
  }
}

loginTest();
