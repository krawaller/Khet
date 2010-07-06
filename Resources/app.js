Ti.UI.setBackgroundColor('#000');

var tabGroup = Ti.UI.createTabGroup();
var win = Ti.UI.createWindow({
    title: 'Khet',
    backgroundColor: '#000',
    tabBarHidden: true,
    navBarHidden: true,
    orientationModes: [Titanium.UI.LANDSCAPE_LEFT, Titanium.UI.LANDSCAPE_RIGHT]
});
var tab = Ti.UI.createTab({
    icon: '',
    title: 'Khet',
    window: win
});
tabGroup.addTab(tab);

var webview = Ti.UI.createWebView({
    url: 'index.html'
});
win.add(webview);
tabGroup.open();
