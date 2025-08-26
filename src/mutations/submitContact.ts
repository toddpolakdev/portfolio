import { gql } from "@apollo/client";

export const SUBMIT_CONTACT = gql`
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
      name
      email
      subject
      message
      createdAt
    }
  }
`;
