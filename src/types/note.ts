


export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag: string;
}

// titleCollapse allstring
// The title of the note

// Example"Sample Note"
// contentCollapse allstring
// The content of the note

// Example"This is a sample note content."
// createdAtCollapse allstringdate-time
// The timestamp when the note was created

// Example"2022-01-01T00:00:00Z"
// updatedAtCollapse allstringdate-time
// The timestamp when the note was last updated

// Example"2022-01-01T00:00:00Z"
// tagCollapse allstring
// The tag assigned to the note

// EnumCollapse allarray
// #0"Work"
// #1"Personal"
// #2"Meeting"
// #3"Shopping"
// #4"Todo"
// Example"Todo"