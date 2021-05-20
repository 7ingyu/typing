import styled from 'styled-components'

export default styled.span`
  &{
    text-decoration: underline;
    opacity: 50%;
    transition: opacity 0.5s
  }
  &:hover{
    opacity: 100%
  }
`;