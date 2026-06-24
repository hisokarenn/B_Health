exports.config = {
    runner: 'local',

    hostname: '127.0.0.1',

    port: 4723,

    path: '/',

    specs: [
        './*.test.js'
    ],

    maxInstances: 1,
    maxInstancesPerCapability: 1,

    capabilities: [{
        platformName: 'Android',

        'appium:automationName': 'UiAutomator2',

        'appium:deviceName': 'emulator-5554',

        'appium:app': './apps/B_Health.apk',

        'appium:appPackage': 'com.bhealth.app',
        
        'appium:appActivity': 'com.bhealth.app.MainActivity',

        'appium:autoGrantPermissions': true,

        'appium:newCommandTimeout': 300,

        'appium:noReset': false,

        'appium:fullReset': false,

        'appium:newCommandTimeout': 300,

        'appium:adbExecTimeout': 120000,

        'appium:uiautomator2ServerInstallTimeout': 120000,

        'appium:uiautomator2ServerLaunchTimeout': 120000,
    }],

    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    framework: 'mocha',

    reporters: ['spec'],

    mochaOpts: {
        timeout: 120000
    }
};