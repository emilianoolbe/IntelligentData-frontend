import { useState } from 'react'
import { useTheme } from './hooks/useTheme'
import { Button } from './components/ui/Button'
import { Card } from './components/ui/Card'
import { Input } from './components/ui/Input'
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from './components/ui/Table'
import { Modal } from './components/ui/Modal'
import { logoComplete } from './assets'

function App() {
  const { theme, toggleTheme, isDark } = useTheme()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={logoComplete} 
              alt="IntelligentData" 
              className="h-10"
            />
            <h1 className="text-xl font-semibold text-primary">
              IntelligentData
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? '☀️' : '🌙'}
            </Button>
            <span className="text-sm text-muted">
              {theme === 'dark' ? 'Dark' : 'Light'} Mode
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="grid gap-8">
          {/* Buttons Demo */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-primary">Buttons</h2>
            <Card className="p-6">
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </Card>
          </section>

          {/* Inputs Demo */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-primary">Inputs</h2>
            <Card className="p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Input 
                  label="Email" 
                  type="email" 
                  placeholder="Enter your email"
                  helperText="We'll never share your email"
                />
                <Input 
                  label="Username" 
                  placeholder="Enter your username"
                  error="Username is required"
                />
                <Input 
                  label="Password" 
                  type="password" 
                  placeholder="Enter your password"
                />
                <Input 
                  label="Search" 
                  placeholder="Search..."
                  fullWidth
                />
              </div>
            </Card>
          </section>

          {/* Table Demo */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-primary">Table</h2>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>John Doe</TableCell>
                    <TableCell>john@example.com</TableCell>
                    <TableCell>Admin</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-success/10 px-2 py-1 text-xs text-success">
                        Active
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Jane Smith</TableCell>
                    <TableCell>jane@example.com</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-warning/10 px-2 py-1 text-xs text-warning">
                        Pending
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Bob Wilson</TableCell>
                    <TableCell>bob@example.com</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-error/10 px-2 py-1 text-xs text-error">
                        Inactive
                      </span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </section>

          {/* Modal Demo */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-primary">Modal</h2>
            <Card className="p-6">
              <Button onClick={() => setIsModalOpen(true)}>
                Open Modal
              </Button>
              
              <Modal 
                open={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title="Example Modal"
                description="This is a sample modal dialog."
              >
                <div className="space-y-4">
                  <Input 
                    label="Example Input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type something..."
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsModalOpen(false)}>
                      Confirm
                    </Button>
                  </div>
                </div>
              </Modal>
            </Card>
          </section>

          {/* Theme Demo */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-primary">Theme Variables</h2>
            <Card className="p-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm text-muted">Background Primary</p>
                  <div className="h-16 rounded-lg border border-border" style={{ backgroundColor: 'var(--bg-primary)' }} />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted">Background Secondary</p>
                  <div className="h-16 rounded-lg border border-border" style={{ backgroundColor: 'var(--bg-secondary)' }} />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted">Accent</p>
                  <div className="h-16 rounded-lg border border-border" style={{ backgroundColor: 'var(--accent)' }} />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted">Error</p>
                  <div className="h-16 rounded-lg border border-border" style={{ backgroundColor: 'var(--error)' }} />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted">Success</p>
                  <div className="h-16 rounded-lg border border-border" style={{ backgroundColor: 'var(--success)' }} />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted">Warning</p>
                  <div className="h-16 rounded-lg border border-border" style={{ backgroundColor: 'var(--warning)' }} />
                </div>
              </div>
            </Card>
          </section>
        </div>
      </main>
    </div>
  )
}

export default App