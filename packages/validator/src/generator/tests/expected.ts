import type { IR } from "../types";

export const expected: Record<string, IR[]> = {
  basic: [
    {
      name: "UserIR",
      type: {
        kind: "object",
        properties: {
          id: {
            kind: "primitive",
            type: "number",
          },
          name: {
            kind: "primitive",
            type: "string",
          },
          active: {
            kind: "primitive",
            type: "boolean",
          },
          nickname: {
            kind: "optional",
            type: {
              kind: "primitive",
              type: "string",
            },
          },
        },
      },
    },
    {
      name: "UserIdIR",
      type: {
        kind: "primitive",
        type: "string",
      },
    },
    {
      name: "StatusIR",
      type: {
        kind: "union",
        types: [
          {
            kind: "literal",
            value: "pending",
          },
          {
            kind: "literal",
            value: "active",
          },
          {
            kind: "literal",
            value: "disabled",
          },
        ],
      },
    },
  ],

  complex: [
    {
      name: "UserIR",
      type: {
        kind: "object",
        properties: {
          id: {
            kind: "primitive",
            type: "number",
          },
          name: {
            kind: "primitive",
            type: "string",
          },
          tags: {
            kind: "array",
            items: {
              kind: "primitive",
              type: "string",
            },
          },
          metadata: {
            kind: "object",
            properties: {
              createdAt: {
                kind: "primitive",
                type: "string",
              },
              updatedAt: {
                kind: "optional",
                type: {
                  kind: "primitive",
                  type: "string",
                },
              },
            },
          },
          status: {
            kind: "union",
            types: [
              {
                kind: "literal",
                value: "active",
              },
              {
                kind: "literal",
                value: "disabled",
              },
            ],
          },
        },
      },
    },
    {
      name: "SearchResultIR",
      type: {
        kind: "union",
        types: [
          {
            kind: "reference",
            name: "UserIR",
          },
          {
            kind: "literal",
            value: null,
          },
        ],
      },
    },
    {
      name: "UserWithIdIR",
      type: {
        kind: "intersection",
        types: [
          {
            kind: "reference",
            name: "UserIR",
          },
          {
            kind: "object",
            properties: {
              id: {
                kind: "primitive",
                type: "number",
              },
            },
          },
        ],
      },
    },
    {
      name: "CoordinatesIR",
      type: {
        kind: "tuple",
        elements: [
          {
            kind: "primitive",
            type: "number",
          },
          {
            kind: "primitive",
            type: "number",
          },
        ],
      },
    },
    {
      name: "MatrixIR",
      type: {
        kind: "array",
        items: {
          kind: "array",
          items: {
            kind: "primitive",
            type: "number",
          },
        },
      },
    },
    {
      name: "MixedTupleIR",
      type: {
        kind: "tuple",
        elements: [
          {
            kind: "primitive",
            type: "string",
          },
          {
            kind: "primitive",
            type: "number",
          },
          {
            kind: "primitive",
            type: "boolean",
          },
        ],
      },
    },
  ],

  enums: [
    {
      name: "StatusIR",
      type: {
        kind: "enum",
        members: [
          {
            name: "Pending",
            value: 0,
          },
          {
            name: "Active",
            value: 1,
          },
          {
            name: "Disabled",
            value: 2,
          },
        ],
      },
    },
    {
      name: "HttpStatusIR",
      type: {
        kind: "enum",
        members: [
          {
            name: "Ok",
            value: 200,
          },
          {
            name: "BadRequest",
            value: 400,
          },
          {
            name: "Unauthorized",
            value: 401,
          },
          {
            name: "NotFound",
            value: 404,
          },
        ],
      },
    },
    {
      name: "RoleIR",
      type: {
        kind: "enum",
        members: [
          {
            name: "Admin",
            value: "admin",
          },
          {
            name: "User",
            value: "user",
          },
          {
            name: "Guest",
            value: "guest",
          },
        ],
      },
    },
  ],

  references: [
    {
      name: "UserIdIR",
      type: {
        kind: "primitive",
        type: "string",
      },
    },
    {
      name: "UserIR",
      type: {
        kind: "object",
        properties: {
          id: {
            kind: "reference",
            name: "UserIdIR",
          },
          name: {
            kind: "primitive",
            type: "string",
          },
        },
      },
    },
    {
      name: "AdminIR",
      type: {
        kind: "intersection",
        types: [
          {
            kind: "reference",
            name: "UserIR",
          },
          {
            kind: "object",
            properties: {
              permissions: {
                kind: "array",
                items: {
                  kind: "primitive",
                  type: "string",
                },
              },
            },
          },
        ],
      },
    },
  ],

  nested: [
    {
      name: "UserIR",
      type: {
        kind: "object",
        properties: {
          id: {
            kind: "primitive",
            type: "number",
          },
        },
      },
    },
    {
      name: "UserIdIR",
      type: {
        kind: "primitive",
        type: "string",
      },
    },
  ],
};
