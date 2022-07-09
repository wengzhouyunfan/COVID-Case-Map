//AIzaSyB39nmljg6mech3o4epM5ZDfi2LNLmM-Xg
import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { CovidDataService } from '../Service/CovidDataService';
import { MapUtils } from '../utils/MapUtils';
import CaseCard from './CaseCard';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class CovidMap extends Component {
  static defaultProps = {
    center: {
      lat: 40,
      lng: -95
    },
    zoom: 6
  };
//哪些改变触发rerender？
//什么时候改变? 定义更新条件，选择合适回调函数
// for in (Map js obj)
  state = {
    points:{
       
    }, //case 更新
    zoomLevel: 6, // zoom in/out 决定展示的是哪一个level（county state ）
    boundary:{}   //拖拽使可视视图改变
  }


  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyB39nmljg6mech3o4epM5ZDfi2LNLmM-Xg" }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          onGoogleApiLoaded={
              () =>{
                  CovidDataService.getAllCountyCases()
                  .then(response =>{// 请求成功时
                this.setState({
                    points: MapUtils.convertCovidPoints(response.data)
                })
                  }).catch(error => console.error(error)); // 请求失败时
              }
          }
          onChange={
              ({ center, zoom, bounds, marginBounds}) =>{
                    this.setState({
                        zoomLevel: zoom,
                        boundary:bounds
                    });
              }
          }
        >
          {this.renderCovidPoints()}
        </GoogleMapReact>
      </div>
    );
  }
  renderCovidPoints(){
      let result = [];
      const zoomLevel = this.state.zoomLevel;
      // 1 - 4 nation level
      // 5 - 9 state
      //10 - 20 county
      let pointsLevel = 'county';
      if(zoomLevel >= 1 && zoomLevel <= 4){
          pointsLevel = 'nation';
      } else if (zoomLevel > 4 && zoomLevel <= 9){
          pointsLevel = 'state';
      }
      const pointsToRender = this.state.points[pointsLevel];
      //为什么要判定这里为空:因为在第一次map出来的时候没有来得及从api拿数据
      if(! pointsToRender){
         return result;
      }
      // county level 显示卡片的处理
      if (pointsLevel === 'county') {
        for (const point of pointsToRender) {
            if (MapUtils.isInBoundary(this.state.boundary, point.coordinates)) {
                result.push(
                    <CaseCard
                        lat={point.coordinates.latitude}
                        lng={point.coordinates.longitude}
                        title={point.province}
                        subTitle={point.county}
                        confirmed={point.stats.confirmed}
                        deaths={point.stats.deaths}
                    />
                )
            }
        }
    } else if (pointsLevel === 'state') {
        for (const state in pointsToRender) {
            const point = pointsToRender[state];
            if (MapUtils.isInBoundary(this.state.boundary, point.coordinates)) {
                result.push(
                    <CaseCard
                        lat={point.coordinates.latitude}
                        lng={point.coordinates.longitude}
                        title={point.country}
                        subTitle={state}
                        confirmed={point.confirmed}
                        deaths={point.deaths}
                    />
                )
            }
        }
    }

    //   if(pointsLevel === 'county'){
    //       for(const point of pointsToRender){
    //           if(MapUtils.isInBoundary(this.state.boundary, point.coordinates)){
    //             result.push(
    //                 <CaseCard
    //                     lat = {point.coordinates.latitude}
    //                     lng = {point.coordinates.longitude}
    //                     title = {point.province}
    //                     subTitle = {point.county}
    //                     confirmed={point.stats.confirmed}
    //                     deaths={point.stats.deaths}
    //                 />
    //             )
    //           }
    //       }
    //   }else if(pointsLevel === 'state'){
    //       for(const state in pointsToRender){
    //           const point = pointsToRender[state];
    //         if(MapUtils.isInBoundary(this.state.boundary, point.coordinates)){
    //             result.push(
    //                 <CaseCard
    //                     lat = {point.coordinates.latitude}
    //                     lng = {point.coordinates.longitude}
    //                     title = {point.county}
    //                     subTitle = {point.state}
    //                     confirmed={point.confirmed}
    //                     deaths={point.deaths}
    //                 />
    //             )
    //           }
    //       }

    //   }

      return result;
  }
}

export default CovidMap;