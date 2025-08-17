import css from './NoteForm.module.css';
import type { Note, CreateNote } from '../../types/note';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';

interface NoteFormProps {
  onSubmit: (note: CreateNote) => void;
  onCancel: () => void;
}

const validationSchema = Yup.object(
  {
    title: Yup.string().min(3).max(50).required('Title is required'),
    content: Yup.string().max(500),
    tag: Yup.mixed<Note['tag']>().oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping']).required('Tag is required'),
  }
);

export default function NoteForm({ onSubmit, onCancel }: NoteFormProps) {

  return (
    <Formik
      initialValues={{ title: '', content: '', tag: 'Todo' as Note['tag'] }}
      validationSchema={validationSchema}
      onSubmit={(values, actions) => {
        onSubmit(values);
        actions.resetForm();
      }}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" className={css.input} autoFocus />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage name="content" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button type="button" className={css.cancelButton} onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className={css.submitButton} disabled={isSubmitting}>
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

