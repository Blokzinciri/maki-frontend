/* eslint-disable import/order */
import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { useLocation } from 'react-router-dom'
import styled from 'styled-components';
import { Text } from 'maki-uikit-v2'
import { darken } from 'polished'

import { DisableCard } from 'components/Card'
import TableNav from './tableNav'
import { Table, TableData } from './table'
import "./styles.css"
import { AppState } from 'state';
import { EOrderStatus, EOrderType, EOrderState } from 'state/limit/enums';
import { shortenAddress } from 'utils';
import CancelOrderModal from '../dialogs';
import { limitSelectOrder } from 'state/limit/actions';

const activeClassName = 'ACTIVE'

const CancelButton = styled.button`
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.textDisabled};
  font-size: 16px;
  border: none;
  background-color: inherit;

  &.${activeClassName} {
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.colors.text)};
  }
`

interface TableLimitOrderProp {
  modalAction?: () => void;
}

export default function ({ modalAction }: TableLimitOrderProp) {
  const { search } = useLocation()
  const dispatch = useDispatch()
  const params = new URLSearchParams(search)
  // const _table = params.get('table')
  const activeIndex = params.get('table') === 'closed-orders' ? 1 : 0
  const { status, orders, error } = useSelector<AppState, AppState['limit']>((s) => s.limit)
  const getData = useCallback((): TableData[] => {
    return orders ?
      orders
        .filter(order => {
          return activeIndex === 0 ? (order.state === EOrderState.CREATED || order.state === EOrderState.FINISHED) :
            order.state === EOrderState.CANCELLED
        })
        .map((order) => {
          return {
            id: order.id,
            type: EOrderType[order.type === EOrderType.BUY ? order.type : EOrderType.SELL],
            pair: `${order.tokenOut.symbol} / ${order.tokenIn.symbol}`,
            mount: order.tokenOutAmount.toFixed(8),
            price: order.price.toFixed(10),
            // transaction: shortenAddress(order.trader),
            // eslint-disable-next-line eqeqeq
            actions: order.status.toString() != EOrderStatus.PROCESSING.toString() && order.state != EOrderState.CANCELLED && order.state != EOrderState.FINISHED
              ? 'Cancel Order' : ' - '
          } as TableData
        }) : []
  }, [orders, activeIndex])
  return (
    <DisableCard marginTop="24px">
      <TableNav
        activeIndex={activeIndex}
      />
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={activeIndex > 0 ? "closed-orders" : "my-orders"}
          in={activeIndex}
          addEndListener={(node, done) => node.addEventListener("transitionend", done, false)}
          classNames="fade"
        >
          <Table
            id="table-my-orders"
            columns={[
              {
                Header: 'Type',
                accessor: 'type'
              },
              {
                Header: 'Pair',
                accessor: 'pair'
              },
              {
                Header: 'Amount',
                accessor: 'mount',
                Cell: ({ value, row }) => {
                  const orderId = row.original.id
                  const bOrder = orders.find(item => item.id === orderId)
                  return (
                    <p>
                      {value}
                      {bOrder && (
                        <span style={{ marginLeft: 5 }}>
                          {bOrder?.tokenOut?.symbol}
                        </span>
                      )}
                    </p>
                  )
                }
              }, {
                Header: 'Price',
                accessor: 'price',
                Cell: ({ value, row }) => {
                  const orderId = row.original.id
                  const bOrder = orders.find(item => item.id === orderId)
                  return (
                    <p>
                      {value}
                      {bOrder && (
                        <span style={{ marginLeft: 5 }}>
                          {bOrder?.tokenIn?.symbol}
                        </span>
                      )}
                    </p>
                  )
                }
              },
              // {
              //   Header: 'Transaction',
              //   accessor: 'transaction'
              // },
              {
                Header: 'Actions',
                accessor: 'actions',
                Cell: ({ value, row }) => {
                  const { original } = row
                  return (
                    <>
                    {
                      value === ' - ' ?
                      <div style={{ cursor: 'pointer' }}>{value}</div>
                      :
                      <CancelButton type="button"
                        onClick={
                          ($e) => {
                            $e.preventDefault()
                            if (original) {
                              dispatch(limitSelectOrder(original?.id))
                            }
                            modalAction?.()
                          }
                        }>
                        {value}
                      </CancelButton>
                    }
                    </>
                  )
                }
              },
            ]}
            data={getData()}
          />
        </CSSTransition>
      </SwitchTransition>
    </DisableCard>
  )
}