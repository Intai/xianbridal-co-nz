export const fontSerif = ({ theme }) => `
  font-family: ${theme.font.serif};
`

export const fontSans = ({ theme }) => `
  font-family: ${theme.font.sansserif};
`

export const fontLogo = ({ theme }) => `
  font-family: ${theme.font.logo};
  font-weight: 700;
`

export const fontTitle = ({ theme }) => `
  font-family: ${theme.font.title};
`

export const fontShadow = () => `
  text-shadow: -1px -1px 15px rgba(0,0,0,0.4),
    1px -1px 15px rgba(0,0,0,0.4),
    -1px 1px 15px rgba(0,0,0,0.4),
    1px 1px 15px rgba(0,0,0,0.4);
`
