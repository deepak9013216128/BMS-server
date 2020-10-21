

exports.getTabs = (req, res, next) => {
  res.status(200).json({
    title: 'first tab',
    category: []
  })
}