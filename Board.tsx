/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable graphql/template-strings */
import React, { useEffect } from 'react'
import { useQuery, useMutation, useManualQuery } from 'graphql-hooks';
import cn from 'classnames'

import {
  QueryBoardOne,
  QueryBoardOne_board_one_widgets,
  QueryBoardOne_board_one,
  IQueryIcons,
  ILicense,
} from '../../types/types';
import './Board.css';
import { infoboardContext } from '../../API/APIProvider';
import { ModalSettingCabinet } from '../../modals/ModalSettingCabinet';
import SettingMode from '../../components/SettingMode';
import { defaultImage } from '../../image/defaultImage'
import { variablesUpdateConfig } from '../../graphql/graphQlVariables';
import WidgetAdd from '../../components/widgetComponents/WidgetAdd';
import {
  EditConfigWidgets,
  GetWidgetDoc,
  GetWidgetDocList,
  QUERY,
  QueryIcons
} from '../../graphql/graphqlRequest';
import { BoardContext, IinitialBoard, boardReducer, initialBoard } from '../../Reducer/boardReducer';
import { getLisance, getName } from '../../API/api';
import { isIE } from '../../utils/constans';
import ErrorDialogBody from '../../components/ErrorComponents/ErrorDialogBody';
import {
  getPalette,
  instanceOfClassifier,
  instanceOfIDocListWidget,
  instanceOfIListFromDocWidget,
  instanceOfIPluginDocListWidget,
  configDefault
} from '../../utils/utils';
import WidgetDnD from '../Widget/WidgetDnD';
import WrapperCustomTreeSelect from '../../components/CustomTreeSelect.tsx/WrapperCustomTreeSelect';

const isTechexpert = !!(window as any).isTechexpert;

export default (
  {
    id,
    title,
    updateChecksum,
    login = '',
    products,
  }:
    {
      id: string,
      title?: string,
      updateChecksum: (product: Array<string>) => void,
      login?: string,
      products: () => void,
    }
) => {
  const [boardState, boardDispatch] = React.useReducer(boardReducer, initialBoard)
  const {
    isOpen,
    isSetting,
    dataEdit,
    dataDefault,
    isClient,
    isEditAccess,
    loadMutation,
    isIcons,
    isReadylicense100031,
    customTreeSelect,
  }: IinitialBoard = boardState;

  const [updateConfig] = useMutation(EditConfigWidgets);
  const { onLoad } = React.useContext(infoboardContext);
  const { data, loading, error, refetch, httpError } = useQuery<QueryBoardOne>(QUERY, { variables: { id } });
  const [getIcons] = useManualQuery<IQueryIcons>(QueryIcons);
  const [fetchListDoc, { data: dataListDoc, loading: loadingListDoc }] = useManualQuery<QueryBoardOne>(GetWidgetDocList);
  const [fetchDoc, { data: dataDoc, loading: loadingDoc }] = useManualQuery<QueryBoardOne>(GetWidgetDoc);

  useEffect(() => {
    getName(boardDispatch) 
    if ((window as any).isSettingMode) {
      !isSetting && boardDispatch({ type: 'CHANGE_SETTING', payload: true });
    }
  }, []);

  useEffect(() => {
    if (!isSetting) return;

    const requestIcons = async () => {
      const dataIcons = await getIcons({ variables: { id } })
      if (dataIcons.error && isIcons) {
        boardDispatch({
          type: 'ERROR_ICONS'
        });
      } else if (dataIcons) {
        boardDispatch({
          type: 'UPDATE_ICONS',
          payload: dataIcons.data.board.one.icons
        });
      }
    }

    const fetchData = async () => {
      const license: ILicense = await getLisance();
      boardDispatch({
        type: 'GET_LICENSE',
        payload: license
      });
    };

    !isReadylicense100031 && fetchData();
    !dataEdit.icons && requestIcons();
  }, [isSetting])


  useEffect(() => {
    if (!data) return;
    const arrWidgets: QueryBoardOne_board_one_widgets[] = [];

    data.board.one.widgets.forEach((widget, i) => {
      const isWidget = Object.keys(widget).length < 3;

      if (
        instanceOfClassifier(widget) && dataDefault.widgets[i]
      ) {
        return arrWidgets.push({ ...dataDefault.widgets[i] })
      }

      if (isWidget
        && !loadingListDoc && dataListDoc && dataListDoc.board.one.widgets[i]
        && (instanceOfIPluginDocListWidget(dataListDoc.board.one.widgets[i])
          || instanceOfIListFromDocWidget(dataListDoc.board.one.widgets[i])
        )) {
        return arrWidgets.push({
          ...dataListDoc.board.one.widgets[i],
          position: widget.position || (i % 2 === 0 ? 'left' : 'right')
        })
      };
      if (isWidget
        && !loadingDoc && dataDoc && dataDoc.board.one.widgets[i]
        && instanceOfIDocListWidget(dataDoc.board.one.widgets[i])
      ) {
        return arrWidgets.push({
          ...dataDoc.board.one.widgets[i],
          position: widget.position || (i % 2 === 0 ? 'left' : 'right')
        });
      }

      return arrWidgets.push({ ...widget, position: widget.position || (i % 2 === 0 ? 'left' : 'right') })
    });

    boardDispatch({
      type: 'GET_FULL_DATA',
      payload: { ...data.board.one, widgets: arrWidgets }
    })

    if ((window as any).isSettingMode) {
      boardDispatch({
        type: 'LOAD_CONFIG',
        payload: { ...data.board.one, widgets: arrWidgets }
      });
      if (dataListDoc && !loadingListDoc && dataDoc && !loadingDoc && data) {
        (window as any).isSettingMode = false;
      }
    }

  }, [data, loadingDoc, loadingListDoc]);

  useEffect(() => {
    if (data) {
      onLoad && onLoad(data.board.one.title);

      fetchDoc({ variables: { id } })
      fetchListDoc({ variables: { id } });
    };

    if (error) {
      onLoad && onLoad(`Infoboard ${id} unavailable.`);
      httpError && httpError.status == 400
        && (window as any).Logger.add('Версия 7475.db6 несовместима с версией infoboard.knm.')
    }
  }, [data, onLoad, error]);

  const currentData: QueryBoardOne_board_one = isSetting
    ? dataEdit
    : data
      ? { ...data.board.one, widgets: dataDefault.widgets }
      : configDefault;


  if (error && httpError) {
    return <ErrorDialogBody
      header={httpError.status == 400
        ? 'Проблема совместимости'
        : 'Цифровой кабинет не найден'
      }
      description={httpError.status == 400
        ? 'Версия 7475.db6 несовместима с версией infoboard.knm. ' +
        'Функциональность "Цифровые кабинеты" недоступна.'
        : `Цифровой кабинет с идентификатором ${id} отсутствует в подключенных продуктах. \
        Пожалуйста, укажите верный идентификатор.`
      }
      request='useQuery'
      answer={`status: ${httpError.status}, ${httpError.statusText}`}
      isRepresentative={true}
      options={httpError.status == 400
        ? {
          version: {
            name: 'Поддерживаемая версия infoboard.knm',
            value: '2.0.7 и старше'
          }
        }
        : undefined
      }
    />
  }

  if (loading || !currentData || loadMutation) return <p>Loading...</p>

  const backdropStyle = () => {
    if (data.board.one.backgroundFilename === 'default_image') return defaultImage;
    if (data.board.one.background) return data.board.one.background;
    return '';
  };

  const updateProducts = async (action?: string) => {
    const getProducts: any = await products();
    const product = getProducts.products.filter((product: any) => product.style === 'individual_products')[0];
    const productList = (product && product.productsList) || [];
    if (action === 'delete') {
      let arr: Array<string> = [];
      productList.forEach((product: any) =>
        product.nd.split('infoboard=')[1] !== id && arr.push(product.nd)
      )
      updateChecksum(arr);
      (window as any).kApp.document.open();
    } else {
      updateChecksum([
        ...productList.map((product: any) => product.nd),
        `, title=${currentData.title}, \
        hiddenOnStartPage: ${currentData.hiddenOnStartPage}, \
        icons: ${currentData.icons}
        `
      ]);
    }
  }
  const palette = currentData.palette || getPalette();
  const colorTextMain = ['#f9a58d', '#eac111', '#bdc0a5'].indexOf(palette.primary.main) === -1 ? '#fff' : '#333333';

  return (
    <div className='infoboard-root' id='infoboard-root'>
      <div className='infoboard-backdrop'>
        <img src={backdropStyle()} className='infoboard-backdrop-image' alt='' />
        <div className='infoboard-nav'
          style={{
            color: palette.primary.text,
            backgroundColor: palette.primary.main
          }}
        >
          <div
            className='infoboard-brand'
            style={{ color: `${colorTextMain}` }}
          >
            {title || `Техэксперт: Цифровые кабинеты`}
          </div>
          {(currentData.logo !== 'null' && currentData.logo !== 'true' && currentData.logo) ? (
            <img
              className="infoboard-logo"
              src={currentData.logo}
              alt={currentData.title}
            />
          ) : (
            <div
              className={cn(`infoboard-logo infoboard-logo-default`, {
                isTechexpert,
              })}
              title={currentData.title}
            />
          )}
          <h3 className='infoboard-header' style={{ color: `${colorTextMain}` }}>
            {currentData.title}
          </h3>
          <div className='infoboard-nav-background'>
            {
              (palette.primary.main === '#E36E26' || palette.primary.main === '#255891')
              && <div className={cn(`img_logo`, { isTechexpert })} />
            }
          </div>
          <div className={`nav_setting ${isClient || isIE ? 'nav_setting_kclient' : ''}`}>
            {isEditAccess
              && (isSetting
                ? <div className={`nav_footer ${isClient || isIE ? 'nav_footer_kclient' : ''}`}>
                  <button className='kApp-flatBtn kApp-flatBtn_blue'
                    onClick={async () => {
                      boardDispatch({ type: 'UPDATE_MUTATION', payload: true })
                      await updateConfig({
                        variables: { ConfigInput: variablesUpdateConfig(currentData, login) }
                      });
                      refetch();
                      boardDispatch({ type: 'CHANGE_SETTING', payload: false })
                      boardDispatch({ type: 'UPDATE_MUTATION', payload: false })
                    }}
                  >
                    Сохранить
                  </button>
                  <button className='kApp-flatBtn'
                    onClick={() => {
                      boardDispatch({ type: 'CHANGE_SETTING', payload: false })
                    }}
                  >
                    Отменить
                  </button>
                </div>
                : <p onClick={() => {
                  boardDispatch({
                    type: 'LOAD_CONFIG',
                    payload: { ...data.board.one, widgets: dataDefault.widgets }
                  });
                  boardDispatch({ type: 'CHANGE_SETTING', payload: !isSetting })
                }}
                  style={{ color: `${colorTextMain}` }}
                >
                  Настроить
                </p>
              )
            }
          </div>
          <BoardContext.Provider value={boardState}>
            {
              isSetting && <SettingMode
                id={id}
                closeModal={() => boardDispatch({
                  type: 'IS_OPEN_MODAL', payload: { isOpen: !isOpen, isSettingWidget: -1 }
                })}
                updateProducts={updateProducts}
              />
            }
          </BoardContext.Provider>
        </div>
        <BoardContext.Provider value={boardState}>
          {
            currentData.widgets.length === 0 && <div
              className={`widgets_container ${isClient || isIE ? 'widgets_container_client' : ''}`}
            >
              {
                isSetting
                  ? <WidgetAdd
                    addWidget={() => boardDispatch({
                      type: 'ADD_NEW_WIDGET', payload: {
                        isOpen: true,
                        isSettingWidget: currentData.widgets.length,
                        isNewWidget: true
                      }
                    })}
                    styleAdd={{
                      position: 'relative',
                      bottom: '0px'
                    }}
                    color={palette.primary.main}
                  />
                  : (login === currentData.author || !currentData.author)
                    ? <>
                      <p>Нет блоков с контентом</p>
                      <p>Создайте их, перейдя в настройки кабинета</p>
                    </>
                    : <p>Автор цифрового кабинета пока не создал ни одного блока с контентом.</p>
              }
            </div>
          }
        </BoardContext.Provider>
        <BoardContext.Provider value={boardState}>
          <WidgetDnD
            currentData={currentData}
            id={id}
            boardDispatch={boardDispatch}
            boardState={boardState}
          />
        </BoardContext.Provider>
        <BoardContext.Provider value={boardState}>
          {
            isOpen &&
            <ModalSettingCabinet
              id={data.board.one.id}
              data={data.board.one}
              updateProducts={updateProducts}
              login={login}
              boardDispatch={boardDispatch}
              refetch={refetch}
            />
          }
        </BoardContext.Provider>
      </div>
      {
        customTreeSelect !== false
        && <WrapperCustomTreeSelect
          currentData={currentData}
          boardDispatch={boardDispatch}
          boardState={boardState}
        />
      }
    </div>
  );
};
