import React, { Component } from 'react';
import { Panel, Polar } from '@extjs/reactor/modern';
import ChartToolbar from '../../ChartToolbar';
import generateData from './generateData';

export default class Multiaxis extends Component {

    constructor() {
        super();
        this.refreshData();
    }

    store = Ext.create('Ext.data.Store', {
        fields: [
            'month',
            'high',
            'low',
            {
                name: 'highF',
                calculate: function (data) {
                    return data.high * 1.8 + 32;
                }
            },
            {
                name: 'lowF',
                calculate: function (data) {
                    return data.low * 1.8 + 32;
                }
            }
        ]
    })

    state = {
        theme: 'default'
    }

    refreshData = () => {
        this.store.loadData(generateData());
    }

    changeTheme = theme => this.setState({ theme })

    render() {
        const { theme } = this.state;

        return (
            <Panel shadow layout="fit">
                <ChartToolbar
                    onThemeChange={this.changeTheme}
                    onRefreshClick={this.refreshData}
                    theme={theme}
                />
                <Polar
                    insetPadding={25}
                    store={this.store}
                    interactions={['rotate']}
                    axes={[{
                        type: 'category',
                        position: 'angular',
                        id: 'main-angular-axis',
                        grid: true,
                        style: {
                            majorTickSize: 20,
                            strokeStyle: 'rgb(73,112,142)'
                        }
                    }, {
                        type: 'category',
                        position: 'angular',
                        linkedTo: 'main-angular-axis',
                        renderer: 'onMultiAxisLabelRender',
                        floating: {
                            value: 20,
                            alongAxis: 'radial-axis'
                        }
                    }, {
                        type: 'numeric',
                        id: 'radial-axis',
                        position: 'radial',
                        label: {
                            fontWeight: 'bold'
                        },
                        floating: {
                            value: 'Jan',
                            alongAxis: 'main-angular-axis'
                        }
                    }]}
                    series={[{
                        type: 'radar',
                        angleField: 'month',
                        radiusField: 'high',
                        style: {
                            globalAlpha: 0.7
                        }
                    }]}
                />
            </Panel>
        )
    }
}