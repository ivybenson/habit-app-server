function makeUsersArray() {
  return [
    {
      id: 1,
      category: "productivity",
      title: "Read LOTR trilogy",
      description: "Read first book by NYE",
      start_date: "2020-01-03T00:00:00.000Z",
      completed_date: "2020-04-03T00:00:00.000Z",
      checked: false,
      category_id: 1,
      user_id: 1,
    },
    {
      id: 2,
      category: "fitness",
      title: "Run very far",
      description: "Run first full marathon by NYE",
      start_date: "2020-01-03T00:00:00.000Z",
      completed_date: "2020-04-03T00:00:00.000Z",
      checked: false,
      category_id: 1,
      user_id: 2,
    },
    {
      id: 3,
      category: "travel",
      title: "Get traveling",
      description: "Visit France by NYE",
      start_date: "2020-01-03T00:00:00.000Z",
      completed_date: "2020-04-03T00:00:00.000Z",
      checked: true,
      category_id: 4,
      user_id: 3,
    },
  ];
}

module.exports = {
  makeUsersArray,
};
