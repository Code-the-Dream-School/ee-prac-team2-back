const Group = require('../models/Group');
const User = require('../models/User');

// @desc    Endpoint for fetching all groups the user is part of (as owner and member)
// @route   GET /api/v1/groups
// @access  signed in users only
const getAllGroups = async (req, res) => {
  // allows user to filter by groups owned or groups where the user is a member
  const { memberType } = req.query;

  let queryObject = {};
  if (memberType === 'owner') {
    queryObject.owner = req.user.userID;
  }
  if (memberType === 'member') {
    queryObject.members = { $in: [req.user.userID] };
  }
  if (!memberType) {
    queryObject = {
      $or: [{ owner: req.user.userID }, { members: req.user.userID }]
    };
  }

  const result = await Group.find(queryObject)
    .populate({
      path: 'owner',
      select: 'email name',
      model: User
    })
    .populate({
      path: 'members',
      select: 'email name',
      model: User
    })
    // .populate({
    //   path: "groupEvents",
    //   select: "_id name",
    //   model: Event
    // })
    .exec();

  return res.json({ count: result.length, groups: result });
};

// @desc    Endpoint for fetching one group
// @route   GET /api/v1/groups/:id
// @access  signed in users only
const getGroup = async (req, res) => {
  const { _id } = req.params;
  const group = await Group.findOne({ _id })
    .populate({
      path: 'owner',
      select: 'email name',
      model: User
    })
    .populate({
      path: 'members',
      select: 'email name',
      model: User
    })
    // .populate({
    //   path: "groupEvents",
    //   select: "_id name description eventDateTime",
    //   model: Event
    // })
    .exec();
  if (!group) {
    res.status(404);
    throw new Error(`Group with ${_id} ID does not exist!`);
  }

  if (
    group.owner._id !== req.user.userID &&
    !group.members.some((member) => member._id === req.user.userID)
  ) {
    console.log('ownerID:', group.owner._id);
    console.log(group.members.some((member) => member._id === req.user.userID));
    throw new Error('You do not have permission to access this group.');
  }

  return res.json(group);
};

// @desc    Endpoint for creating a group
// @route   POST /api/v1/activities
// @access  signed in users only
const createGroup = async (req, res) => {
  const { groupName, description, memberEmails } = req.body;

  // Find all users with matching emails
  const foundUsers = await User.find(
    { email: { $in: memberEmails } },
    '_id email'
  );

  // Get all of the memberEmails that exist in the User database
  const foundEmails = foundUsers?.map((user) => user.email);

  // Get all of the attempted memberEmails that do not exist in the User database
  const missingEmails = memberEmails?.filter(
    (email) => !foundEmails.includes(email)
  );

  // Add the found userIDs to the group's members array
  const memberIDs = foundUsers?.map((user) => user._id);

  const newGroup = await Group.create({
    groupName,
    description,
    owner: req.user.userID,
    members: memberIDs
  });

  let msg = 'Group successfully created';
  if (missingEmails?.length > 0) {
    msg += ` but the following users could not be added: ${missingEmails}`;
  }

  // Sending back missing emails so FE can show who wasn't added (if necessary)
  res.status(200).json({ msg, newGroup, missingEmails });
};

// @desc    Endpoint for updating a group
// @route   PUT /api/v1/groups/:id
// @access  group owner only
const updateGroup = async (req, res) => {
  const { _id } = req.params;
  const { groupName, description, memberEmails } = req.body;

  if (!groupName) {
    res.status(400);
    throw new Error('New group name must be provided!');
  }

  // Find all users with matching emails
  const foundUsers = await User.find(
    { email: { $in: memberEmails } },
    '_id email'
  );

  // Get all of the memberEmails that exist in the User database
  const foundEmails = foundUsers?.map((user) => user.email);

  // Get all of the attempted memberEmails that do not exist in the User database
  const missingEmails = memberEmails?.filter(
    (email) => !foundEmails.includes(email)
  );

  // Add the found user IDs to the group's members array
  const memberIDs = foundUsers?.map((user) => user._id);

  const updatedGroup = await Group.findOneAndUpdate(
    { _id, owner: req.user.userID },
    { groupName, description, members: memberIDs },
    { new: true, runValidators: true }
  );

  if (!updatedGroup) {
    res.status(400);
    throw new Error(
      'An error occurred: the group does not exist or you do not have permission to perform this action.'
    );
  }

  let msg = '';
  if (groupName || description || (memberEmails && !missingEmails)) {
    msg = 'Group successfully updated';
    if (missingEmails?.length > 0) {
      msg += ` but the following user(s) could not be added: ${missingEmails}`;
    }
  }
  if (memberEmails && !groupName && !description && missingEmails?.length > 0) {
    msg = `The following user(s) could not be added: ${missingEmails}`;
  }

  return res.json({ msg, updatedGroup, missingEmails });
};

// @desc    Endpoint for deleting a group
// @route   DELETE /api/v1/groups/:_id
// @access  group owner only
const deleteGroup = async (req, res) => {
  const { _id } = req.params;
  const group = await Group.findOneAndDelete({ _id, owner: req.user.userID });
  if (!group) {
    res.status(400);
    throw new Error(
      'An error occurred: the group does not exist or you do not have permission to perform this action.'
    );
  }

  return res.json({ msg: `Successfully removed group with ID: ${_id}` });
};

module.exports = {
  getAllGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup
};
