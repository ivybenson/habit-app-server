function makeHabitArray() {
  return [
    {
      id: 1,
      title: "journaling",
      frequency: 5,
      created: "2020-01-03T00:00:00.000Z",
      note: "Get your thoughts down every morning",
      user_id: 1,
    },
    {
      id: 2,
      title: "journaling",
      frequency: 5,
      created: "2020-01-04T00:00:00.000Z",
      note: "Get your thoughts down every morning",
      user_id: 3,
    },
    {
      id: 3,
      title: "journaling",
      frequency: 5,
      created: "2020-01-05T00:00:00.000Z",
      note: "Get your thoughts down every morning",
      user_id: 4,
    },
  ];
}

module.exports = {
  makeHabitArray,
};
