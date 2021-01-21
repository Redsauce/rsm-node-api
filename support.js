function checkIfNockIsUsed(nock) {
  if (!nock.isDone()) {
    nock.cleanAll();
    throw new Error('Not all nock interceptors were used!');
  }
}

module.exports = {
  checkIfNockIsUsed
}
