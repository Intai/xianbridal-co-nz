export const extractPathParams = path => {
  const matches = path.match(/^\/([^/]*)(\/([^/]*))?(\/([^/]*))?/i) || []
  const category = matches[1] || null

  if (!category || category === 'static') {
    return {
      category: null,
      query: null,
      id: null,
    }
  }
  if (matches[5]) {
    return {
      category,
      query: matches[3],
      id: matches[5],
    }
  }
  return {
    category,
    query: null,
    id: matches[3] || null,
  }
}
