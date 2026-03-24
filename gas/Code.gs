function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('AI Service Flow Visualizer')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
