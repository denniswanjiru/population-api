module.exports = {
  mongoose,
  connect: () => {
    mongoose.Promise = Promise;
    mongoose.connect(config.database[process.env.NODE_ENV]);
  },
  disconnect: (done) => {
    mongoose.disconnect(done);
  },
};