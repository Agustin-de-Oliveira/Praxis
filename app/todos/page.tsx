import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos } = await supabase.from('todos').select()

  return (
    <div className="p-10 text-white">
      <h1 className="text-2xl font-serif mb-6">Todos (Supabase Test)</h1>
      <ul className="space-y-2">
        {todos?.map((todo) => (
          <li key={todo.id} className="font-mono text-sm border-b border-white/10 pb-2">
            {todo.name}
          </li>
        ))}
        {(!todos || todos.length === 0) && (
          <p className="text-muted-foreground text-xs italic">No todos found or table does not exist.</p>
        )}
      </ul>
    </div>
  )
}
