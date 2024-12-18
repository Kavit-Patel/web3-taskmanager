/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/task_manager.json`.
 */
export type TaskManager = {
  "address": "LmKARybxpp3RuR2xMjiL4yWNzjLJPsfgrH7GFxjRVPe",
  "metadata": {
    "name": "taskManager",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "completeTask",
      "discriminator": [
        109,
        167,
        192,
        41,
        129,
        108,
        220,
        196
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "userAccount"
          ]
        },
        {
          "name": "userAccount",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "isComplete",
          "type": "bool"
        }
      ]
    },
    {
      "name": "deleteTask",
      "discriminator": [
        112,
        220,
        10,
        109,
        3,
        168,
        46,
        73
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "userAccount"
          ]
        },
        {
          "name": "userAccount",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "initializeTask",
      "discriminator": [
        96,
        206,
        3,
        20,
        245,
        167,
        60,
        125
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "userAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "arg",
                "path": "title"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "input",
          "type": {
            "defined": {
              "name": "taskInput"
            }
          }
        }
      ]
    },
    {
      "name": "modifyTask",
      "discriminator": [
        40,
        247,
        80,
        72,
        219,
        245,
        136,
        121
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "userAccount"
          ]
        },
        {
          "name": "userAccount",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "input",
          "type": {
            "defined": {
              "name": "taskInput"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "accountState",
      "discriminator": [
        168,
        34,
        15,
        31,
        235,
        191,
        144,
        177
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unauthorized",
      "msg": "You are not authorized to perform this action."
    }
  ],
  "types": [
    {
      "name": "accountState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "priority",
            "type": "u8"
          },
          {
            "name": "addedDate",
            "type": "i64"
          },
          {
            "name": "dueDate",
            "type": "i64"
          },
          {
            "name": "isComplete",
            "type": "bool"
          },
          {
            "name": "owner",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "taskInput",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "priority",
            "type": "u8"
          },
          {
            "name": "addedDate",
            "type": "i64"
          },
          {
            "name": "dueDate",
            "type": "i64"
          },
          {
            "name": "isComplete",
            "type": "bool"
          },
          {
            "name": "owner",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};
