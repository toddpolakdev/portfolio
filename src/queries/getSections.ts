import { gql } from "@apollo/client";

export const GET_SECTIONS = gql`
  query GetSections {
    sections(ids: ["hero", "about", "skills", "experience", "education"]) {
      id
      title
      subtitle
      description
      content
      skills {
        category
        tags
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
    }
  }
`;
