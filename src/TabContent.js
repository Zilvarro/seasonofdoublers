export default function TabContent({selectedTabKey, children}) {
    if (Array.isArray(children))
      return children.find((child)=>(child.props.tabKey === selectedTabKey))
    else return children
}