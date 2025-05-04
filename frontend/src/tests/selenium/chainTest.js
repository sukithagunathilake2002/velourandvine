const { By, Key, until } = require('selenium-webdriver');
const { createDriver } = require('./BaseTest');
const { newUser } = require('./utils/testData');

async function chainTest() {
  const driver = await createDriver();

  try {
    await driver.get('http://localhost:3000/RegisterPage');

    await driver.findElement(By.name('name')).sendKeys('Chain Test User');
    await driver.findElement(By.name('email')).sendKeys(newUser.email);
    await driver.findElement(By.name('phone')).sendKeys('1234567890');
    await driver.findElement(By.name('password')).sendKeys(newUser.password);
    await driver.findElement(By.name('confirmPassword')).sendKeys(newUser.password);
    await driver.findElement(By.css('button[type="submit"]')).click();

    console.log(`✅ Registered new user: ${newUser.email}`);

    await driver.sleep(3000); // wait for registration

    await driver.get('http://localhost:3000/LoginPage');

    await driver.findElement(By.name('email')).sendKeys(newUser.email);
    await driver.findElement(By.name('password')).sendKeys(newUser.password, Key.RETURN);

    await driver.wait(
      async () => {
        const url = await driver.getCurrentUrl();
        return url.includes('/reserve') || url.endsWith('/');
      },
      10000,
      'Login navigation did not happen'
    );

    console.log(`✅ Login successful for user: ${newUser.email}`);

    // 🛑 WAIT before closing
    await driver.sleep(10000);  // Wait for 10 seconds before quitting!
  } catch (err) {
    console.error('❌ Chain Test Failed:', err);
  } finally {
    await driver.quit();
  }
}

chainTest();
