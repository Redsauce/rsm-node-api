function matchForm(body, form) {
  return Object.entries(form)
    .reduce((matches, [key, value]) => {
      return matches && body.includes(`name="${key}"\r\n\r\n${value}\r\n`)
    }, true)
}

module.exports = matchForm;
