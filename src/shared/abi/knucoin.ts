export const abi = [
  {
    'inputs': [
      {
        'internalType': 'uint64',
        'name': 'issuer',
        'type': 'uint64',
      },
      {
        'internalType': 'string',
        'name': 'name_',
        'type': 'string',
      },
      {
        'internalType': 'string',
        'name': 'symbol_',
        'type': 'string',
      },
    ],
    'stateMutability': 'nonpayable',
    'type': 'constructor',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'internalType': 'uint128',
        'name': 'arrangementId',
        'type': 'uint128',
      },
      {
        'indexed': true,
        'internalType': 'uint64',
        'name': 'userId',
        'type': 'uint64',
      },
      {
        'indexed': false,
        'internalType': 'enum Arrangements.ArrangementStatus',
        'name': 'arrangementStatus',
        'type': 'uint8',
      },
    ],
    'name': 'ArrangementEvent',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'internalType': 'uint128',
        'name': 'arrangementId',
        'type': 'uint128',
      },
      {
        'indexed': true,
        'internalType': 'uint64',
        'name': 'memberId',
        'type': 'uint64',
      },
      {
        'indexed': false,
        'internalType': 'enum Arrangements.MembershipStatus',
        'name': 'membershipStatus',
        'type': 'uint8',
      },
    ],
    'name': 'MembershipEvent',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'previousOwner',
        'type': 'address',
      },
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'newOwner',
        'type': 'address',
      },
    ],
    'name': 'OwnershipTransferred',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'internalType': 'uint64',
        'name': 'teacherId',
        'type': 'uint64',
      },
      {
        'indexed': true,
        'internalType': 'uint64',
        'name': 'userId',
        'type': 'uint64',
      },
      {
        'indexed': false,
        'internalType': 'enum Teachers.TeacherStatus',
        'name': 'teacherStatus',
        'type': 'uint8',
      },
    ],
    'name': 'TeacherEvent',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'internalType': 'uint64',
        'name': 'from',
        'type': 'uint64',
      },
      {
        'indexed': true,
        'internalType': 'uint64',
        'name': 'to',
        'type': 'uint64',
      },
      {
        'indexed': false,
        'internalType': 'uint256',
        'name': 'amount',
        'type': 'uint256',
      },
    ],
    'name': 'Transfer',
    'type': 'event',
  },
  {
    'inputs': [
      {
        'internalType': 'uint64',
        'name': 'issuer',
        'type': 'uint64',
      },
      {
        'internalType': 'uint64',
        'name': 'memberId',
        'type': 'uint64',
      },
      {
        'internalType': 'uint128',
        'name': 'arrangementId',
        'type': 'uint128',
      },
    ],
    'name': 'addMember',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'uint64',
        'name': 'issuer',
        'type': 'uint64',
      },
      {
        'internalType': 'uint64',
        'name': 'userId',
        'type': 'uint64',
      },
    ],
    'name': 'addTeacher',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [],
    'name': 'arrangementLimit',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'uint64',
        'name': 'userId',
        'type': 'uint64',
      },
    ],
    'name': 'balanceOf',
    'outputs': [
      {
        'internalType': 'uint32',
        'name': '',
        'type': 'uint32',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'uint64',
        'name': 'issuer',
        'type': 'uint64',
      },
      {
        'internalType': 'uint32',
        'name': 'reward',
        'type': 'uint32',
      },
    ],
    'name': 'createArrangement',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [],
    'name': 'decimals',
    'outputs': [
      {
        'internalType': 'uint8',
        'name': '',
        'type': 'uint8',
      },
    ],
    'stateMutability': 'pure',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'uint64',
        'name': 'teacherId',
        'type': 'uint64',
      },
    ],
    'name': 'getArrangements',
    'outputs': [
      {
        'internalType': 'uint128[]',
        'name': '',
        'type': 'uint128[]',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'uint128',
        'name': 'arrangementId',
        'type': 'uint128',
      },
    ],
    'name': 'getMembers',
    'outputs': [
      {
        'internalType': 'uint64[]',
        'name': '',
        'type': 'uint64[]',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'uint128',
        'name': 'arrangementId',
        'type': 'uint128',
      },
    ],
    'name': 'getRewardAmount',
    'outputs': [
      {
        'internalType': 'uint32',
        'name': '',
        'type': 'uint32',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'uint128',
        'name': 'arrangementId',
        'type': 'uint128',
      },
    ],
    'name': 'getTotalMembers',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'uint64',
        'name': 'id',
        'type': 'uint64',
      },
    ],
    'name': 'isTeacher',
    'outputs': [
      {
        'internalType': 'bool',
        'name': '',
        'type': 'bool',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'uint64',
        'name': 'issuer',
        'type': 'uint64',
      },
      {
        'internalType': 'uint64',
        'name': 'userId',
        'type': 'uint64',
      },
      {
        'internalType': 'uint32',
        'name': 'amount',
        'type': 'uint32',
      },
    ],
    'name': 'mint',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [],
    'name': 'name',
    'outputs': [
      {
        'internalType': 'string',
        'name': '',
        'type': 'string',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [],
    'name': 'owner',
    'outputs': [
      {
        'internalType': 'address',
        'name': '',
        'type': 'address',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'uint64',
        'name': 'issuer',
        'type': 'uint64',
      },
      {
        'internalType': 'uint128',
        'name': 'arrangementId',
        'type': 'uint128',
      },
    ],
    'name': 'removeArrangement',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'uint64',
        'name': 'issuer',
        'type': 'uint64',
      },
      {
        'internalType': 'uint64',
        'name': 'memberId',
        'type': 'uint64',
      },
      {
        'internalType': 'uint128',
        'name': 'arrangementId',
        'type': 'uint128',
      },
    ],
    'name': 'removeMember',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'uint64',
        'name': 'issuer',
        'type': 'uint64',
      },
      {
        'internalType': 'uint64',
        'name': 'userId',
        'type': 'uint64',
      },
    ],
    'name': 'removeTeacher',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [],
    'name': 'renounceOwnership',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [],
    'name': 'symbol',
    'outputs': [
      {
        'internalType': 'string',
        'name': '',
        'type': 'string',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': 'newOwner',
        'type': 'address',
      },
    ],
    'name': 'transferOwnership',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
];
