import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { codeState, checkpoint } = await req.json()

    if (!codeState || !checkpoint || !checkpoint.validation) {
      return NextResponse.json(
        { passed: false, message: 'Missing codeState or checkpoint validation criteria.' },
        { status: 400 }
      )
    }

    const validationStr = checkpoint.validation as string
    const firstColonIndex = validationStr.indexOf(':')
    
    if (firstColonIndex === -1) {
      return NextResponse.json(
        { passed: false, message: `Invalid validation format: "${validationStr}"` },
        { status: 400 }
      )
    }

    const type = validationStr.substring(0, firstColonIndex)
    const params = validationStr.substring(firstColonIndex + 1)

    let passed = false
    let message = ''

    switch (type) {
      case 'file_exists': {
        const filePath = params.trim()
        const exists = codeState[filePath] !== undefined
        passed = exists
        message = exists 
          ? `File "${filePath}" exists.` 
          : `Required file "${filePath}" is missing.`
        break
      }

      case 'not_empty': {
        const filePath = params.trim()
        const content = codeState[filePath]
        const existsAndNotEmpty = content !== undefined && content.trim().length > 0
        passed = existsAndNotEmpty
        message = existsAndNotEmpty 
          ? `File "${filePath}" is not empty.` 
          : `File "${filePath}" is empty or does not exist.`
        break
      }

      case 'contains_string': {
        // format is contains_string:filePath:pattern
        const secondColonIndex = params.indexOf(':')
        if (secondColonIndex === -1) {
          return NextResponse.json(
            { passed: false, message: `contains_string requires a file path and a search pattern. Received: "${params}"` },
            { status: 400 }
          )
        }
        const filePath = params.substring(0, secondColonIndex).trim()
        const searchPattern = params.substring(secondColonIndex + 1)
        
        const fileContent = codeState[filePath]
        if (fileContent === undefined) {
          passed = false
          message = `File "${filePath}" not found, unable to search for pattern.`
        } else {
          const contains = fileContent.includes(searchPattern)
          passed = contains
          message = contains 
            ? `Found expected pattern in "${filePath}".` 
            : `Could not find pattern "${searchPattern}" inside "${filePath}".`
        }
        break
      }

      default:
        return NextResponse.json(
          { passed: false, message: `Unknown validator type: "${type}"` },
          { status: 400 }
        )
    }

    return NextResponse.json({ passed, message })
  } catch (error: any) {
    return NextResponse.json(
      { passed: false, message: error.message || 'Validation failed due to an internal error.' },
      { status: 500 }
    )
  }
}
