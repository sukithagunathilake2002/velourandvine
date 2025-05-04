const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('chromedriver');

async function reservationFormTest() {
  const options = new chrome.Options();
  options.addArguments('--no-sandbox', '--disable-dev-shm-usage', '--remote-allow-origins=*');
  
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    // 1. Open the Reservation Page
    await driver.get('http://localhost:3000/Reservation');
    console.log('✅ Opened Reservation Form page');

    await driver.sleep(2000);

    // 2. Fill the form fields
    await driver.findElement(By.name('customerName')).sendKeys('John Doe');
    console.log('✅ Entered Customer Name');

    await driver.findElement(By.name('customerEmail')).sendKeys('johndoe@example.com');
    console.log('✅ Entered Email');

    await driver.findElement(By.name('customerPhone')).sendKeys('1234567890');
    console.log('✅ Entered Phone Number');

    await driver.sleep(1000);

    // 3. Select a Table
    const tableDropdown = await driver.findElement(By.name('tableId'));
    await tableDropdown.click();
    await driver.sleep(1000);
    
    const tableOptions = await driver.findElements(By.css('select[name="tableId"] option'));
    if (tableOptions.length > 1) { 
      await tableOptions[1].click(); // Select the first available table after "-- Select a Table --"
      console.log('✅ Selected Table');
    } else {
      console.warn('⚠️ No tables available to select!');
    }

    await driver.sleep(1000);

    // 4. Pick a Date
    const today = new Date().toISOString().split('T')[0]; // Format: yyyy-mm-dd
    await driver.findElement(By.name('date')).sendKeys(today);
    console.log('✅ Selected Date');

    await driver.sleep(500);

    // 5. Pick a Time Slot
    const timeDropdown = await driver.findElement(By.name('timeSlot'));
    await timeDropdown.click();
    await driver.sleep(500);

    const timeOptions = await driver.findElements(By.css('select[name="timeSlot"] option'));
    if (timeOptions.length > 1) {
      await timeOptions[1].click(); // Select first available time
      console.log('✅ Selected Time Slot');
    } else {
      console.warn('⚠️ No time slots available!');
    }

    await driver.sleep(500);

    // 6. Click Submit button
    const submitButton = await driver.findElement(By.xpath("//button[contains(text(),'Submit')]"));
    await submitButton.click();
    console.log('✅ Clicked Submit Button');

    await driver.sleep(5000); // Wait for redirection / success alert

    console.log('🎯 Reservation Form Test Completed Successfully!');

    // (Optional) Validate redirection if needed
    const currentUrl = await driver.getCurrentUrl();
    if (currentUrl.includes('/reservations')) {
      console.log('✅ Successfully redirected to Reservations page');
    } else {
      console.warn('⚠️ No redirection happened.');
    }

    await driver.sleep(3000);

  } catch (error) {
    console.error('❌ Reservation Form Test Failed:', error);
  } finally {
    await driver.quit();
  }
}

reservationFormTest();
