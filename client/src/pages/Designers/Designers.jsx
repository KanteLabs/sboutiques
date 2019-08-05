import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {Table} from 'semantic-ui-react';
import Spinner from '../../components/Spinner';

const tableStyle = {
    border: 'none',
    outline: 'none',
};
class Designers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            brandData: false,
        };
    }

    componentWillMount() {
        if (!this.props.brandData) {
            axios.get('/api/brands').then(res => {
                this.setState({
                    brandData: res.data,
                });
                return this.props.storeFeed(res.data);
            });
        } else {
            this.setState({
                brandData: this.props.brandData,
            });
        }
    }

    renderBrands(brand) {
        return (
            <div className="designer-table" key={brand.id}>
                <Table fixed singleLine style={tableStyle}>
                    <Table.Body>
                        <Table.Row className="table-contents">
                            <Table.Cell width={3} className="table-title">
                                <Link
                                    to={`/designers/${brand.name}/${brand.id}`}
                                >
                                    {brand.name}
                                </Link>
                            </Table.Cell>
                            <Table.Cell className="table-description">
                                {brand.description}
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </div>
        );
    }

    render() {
        const {brandData} = this.state;
        return (
            <section id="brand-list">
                <div className="brand-list">
                    <h1 className="ui header">Designers</h1>
                    <div className="page-container">
                        {this.state.brandData ? (
                            brandData.map(this.renderBrands)
                        ) : (
                            <Spinner />
                        )}
                    </div>
                </div>
            </section>
        );
    }
}

export default Designers;
