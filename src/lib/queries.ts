/** GraphQL documents shared by the public site and the admin portal. */

export const SECTION_FIELDS = /* GraphQL */ `
  fragment SectionFields on Section {
    _id
    id
    title
    type
    subtitle
    description
    content
    skills {
      category
      tags {
        name
        url
      }
    }
    experience {
      title
      company
      duration
      description
    }
    education {
      degree
      institution
      duration
      description
    }
    links {
      label
      url
      icon
    }
    background
    order
    published
    updatedAt
  }
`;

export const PROJECT_FIELDS = /* GraphQL */ `
  fragment ProjectFields on Project {
    _id
    slug
    title
    tagline
    description
    image
    images
    tags
    liveUrl
    githubUrl
    year
    role
    status
    featured
    order
    updatedAt
  }
`;

export const GET_SECTIONS = /* GraphQL */ `
  ${SECTION_FIELDS}
  query GetSections {
    sections {
      ...SectionFields
    }
  }
`;

export const GET_PROJECTS = /* GraphQL */ `
  ${PROJECT_FIELDS}
  query GetProjects {
    projects {
      ...ProjectFields
    }
  }
`;

export const GET_PROJECT = /* GraphQL */ `
  ${PROJECT_FIELDS}
  query GetProject($slug: String!) {
    project(slug: $slug) {
      ...ProjectFields
    }
  }
`;

/* ---------------------------------------------------------------- admin -- */

export const GET_ADMIN_SECTIONS = /* GraphQL */ `
  ${SECTION_FIELDS}
  query AdminSections {
    adminSections {
      ...SectionFields
    }
  }
`;

export const GET_ADMIN_PROJECTS = /* GraphQL */ `
  ${PROJECT_FIELDS}
  query AdminProjects {
    adminProjects {
      ...ProjectFields
    }
  }
`;

export const GET_CONTACTS = /* GraphQL */ `
  query Contacts($unreadOnly: Boolean) {
    contacts(unreadOnly: $unreadOnly) {
      _id
      name
      email
      subject
      message
      read
      createdAt
    }
  }
`;

export const GET_UNREAD_COUNT = /* GraphQL */ `
  query UnreadCount {
    unreadContactCount
  }
`;

export const UPSERT_SECTION = /* GraphQL */ `
  ${SECTION_FIELDS}
  mutation UpsertSection($input: SectionInput!) {
    upsertSection(input: $input) {
      ...SectionFields
    }
  }
`;

export const UPSERT_PROJECT = /* GraphQL */ `
  ${PROJECT_FIELDS}
  mutation UpsertProject($input: ProjectInput!) {
    upsertProject(input: $input) {
      ...ProjectFields
    }
  }
`;

export const DELETE_PROJECT = /* GraphQL */ `
  mutation DeleteProject($slug: String!) {
    deleteProject(slug: $slug)
  }
`;

export const REORDER_PROJECTS = /* GraphQL */ `
  mutation ReorderProjects($orders: [ProjectOrderInput!]!) {
    reorderProjects(orders: $orders) {
      slug
      order
    }
  }
`;

export const MARK_CONTACT_READ = /* GraphQL */ `
  mutation MarkContactRead($id: ID!, $read: Boolean!) {
    markContactRead(id: $id, read: $read) {
      _id
      read
    }
  }
`;

export const DELETE_CONTACT = /* GraphQL */ `
  mutation DeleteContact($id: ID!) {
    deleteContact(id: $id)
  }
`;

export const SIGN_UPLOAD = /* GraphQL */ `
  mutation SignUpload($folder: String) {
    signUpload(folder: $folder) {
      signature
      timestamp
      apiKey
      cloudName
      folder
    }
  }
`;

export const SUBMIT_CONTACT = /* GraphQL */ `
  mutation SubmitContact(
    $name: String!
    $email: String!
    $subject: String!
    $message: String!
  ) {
    submitContact(
      name: $name
      email: $email
      subject: $subject
      message: $message
    ) {
      _id
    }
  }
`;
