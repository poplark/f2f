async function createRole(ctx, roleType) {
  const { Permission, Role } = ctx.orm();

  let operation;
  switch(roleType) {
    case 'speaker':
      roleType = 'speaker';
      operation = 'push';
      break;
    case 'audience':
    default:
      roleType = 'audience';
      operation = 'pull';
  }
  const permission = await Permission.findOne({ where: { RTCOperation: operation }})

  const role = new Role({
      RTCRole: roleType,
      permission: permission.id,
  });

  await role.save();

  return role;
}

async function removeRole() {
}

async function findRole(ctx, roleType) {
  const { Role } = ctx.orm();

  switch(roleType) {
    case 'speaker':
      roleType = 'speaker';
      break;
    case 'audience':
    default:
      roleType = 'audience';
  }

  const role = await Role.findOne({where: {RTCRole: roleType}});

  return role;
}

async function updateRole() {
}

module.exports = {
  createRole,
  findRole,
  removeRole,
  updateRole,
}
