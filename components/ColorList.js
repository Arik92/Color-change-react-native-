import React, { Component } from 'react';
import {
  ListView,
  StyleSheet,
  AsyncStorage
  } from 'react-native';
  import ColorForm from './ColorForm';
  import ColorButton from './ColorButton';
export default class ColorList extends Component {
  constructor(){
    super();
    this.ds = new ListView.DataSource({
      rowHasChanged: (r1,r2) => r1!==r2
    });
    const allColors = [];
    this.state = {
      allColors,
      dataSource: this.ds.cloneWithRows(allColors)
    };
    this.newColor = this.newColor.bind(this);
  }//constructor

  componentDidMount() {
    AsyncStorage.getItem('@ColorsListStore:Colors',(err, data) => {
      if (err) {
        console.error('something went wrong', err);
      } else {
        const allColors = JSON.parse(data);
        this.setState({
          allColors,
          dataSource: this.ds.cloneWithRows(allColors)
        })
      }//else
    })//getItem callback
  }

  saveColors(colors) {
    AsyncStorage.setItem(
      '@ColorsListStore:Colors',
      JSON.stringify(colors)
    );
    // AsyncStorage.removeItem(
    //   '@ColorsListStore:Colors',
    //   (err)=> {
    //     if (err) {
    //       console.error('deletion error', err);
    //     }//if
    //   }//callback
    // );
  }//saveColors

  newColor(color) {
    const allColors = [...this.state.allColors,color];
    this.setState({
      allColors,
      dataSource: this.ds.cloneWithRows(allColors)
    })//setState
    this.saveColors(allColors);
  }//newColor -add a new color to the color list and updates the datasource
  render() {
    const {backgroundColor, dataSource} = this.state;
    return (
      <ListView style={[styles.container,{backgroundColor}]}
      enableEmptySections={true}
       dataSource = {dataSource}
       renderRow ={(color)=>(<ColorButton backgroundColor={color}
       onSelect={this.props.onColorSelected}/>)}
       renderHeader={()=>(
           <ColorForm onNewColor={this.newColor}/>
         )}>
      </ListView>
    )
    }//render
  }//component

  ColorList.defaultProps = {
    onColorSelected: f=>f
  };

  ColorList.propTypes = {
    onColorSelected: React.PropTypes.func
  };

const styles = StyleSheet.create({
  container:{
    flex: 1
  },
  header: {
    backgroundColor: 'lightgrey',
    paddingTop: 20,
    padding: 10,
    fontSize: 30,
    textAlign: 'center'
  }
});
