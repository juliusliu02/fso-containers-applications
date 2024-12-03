import { render, screen } from '@testing-library/react'
import Todo from './Todo'

test('renders content', () => {
  const todo = {
    text: 'Testing render',
    done: false
  }

  render(<Todo todo={todo} onClickComplete={() => console.log} onClickDelete={() => console.log} />)

  const element = screen.getByText('This todo is not done')
  expect(element).toBeDefined()
})