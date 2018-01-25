```javascript
{
  //List<Country>
  country: {
    list: [{
      _id,
      name,
      code
    }],
    entries: {
      
    }
  } ,

  //List<Currency>
  currencies: [{
    _id,
    name,
    code
  }],

  //List<Enum>
  enums: [{
    _id,
    type,
    name,
    code,
    value,
    category,
    abbreviation,
    comment
  }],

  //List<CostType>
  costTypes: [{
    _id,
    code,
    name,
    parent,
  }],

  //List<Product>
  products: [{
    _id,
    code,
    name,
    parent,
    costTypes: [{
      costType, //ref
      index,
      defaultVisible,
      isEditable,
      tags:[{
        orderTypeCode,
        isVisible
      }]
    }],
    sort,
    visible,
    configs,
    // List<Tag>
    tags: [{
      name,
      value
    }]
  }],

  //Ships
  ships: [{
    __v,
    _id,
    imo,
    length,
    name,
    nationality, //ref
    sizeType, //ref
    type, //ref
    grt: {
      ictm69,
      suez,
    },
    nrt: {
      ictm69,
      suez,
    }
  }],

  //User
  session: {
    last: {
      username,
      fullname,
      photo,
      photoURL,
      quick,
      loggingOut,
    },
    //User
    user: {
      _id,
      username,
      status,
      photo,
      photoURL,
      fullname,
      name,
      position,
    },
    // UserPosition
    position: {
      _id,
      user, //ref
      title,
      dateValid,
      dateExpire,
      status,
      onHoliday,
      holidayDuration
    },
    // UserGroup
    group: {
      _id,
      name,
      description,
      parent, //ref: UserGroup
      creator, //ref: UserPosition
      owner, // ref: UserPosition
      admins: [] //List<ref>
    },
    // Account
    account: {
      _id,
      // Organization
      organization: {
        _id,
        name,
      },
      owner, //ref: UserPosition
      types
    }
  },
  // List<User>
  users: [{
    _id,
    photo,
    photoURL,
    fullname,
    // UserPosition
    position: {
      _id,
      user, //ref
      title,
      status,
      onHoliday
    },
    // Account
    account: {
      _id,
      organization: {
        _id,
        name,
      }
    }
  }]
}
```
