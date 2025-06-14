export default function TabContent({selectedTabKey, children}) {
    return children.find((child)=>(child.props.tabKey === selectedTabKey))
}