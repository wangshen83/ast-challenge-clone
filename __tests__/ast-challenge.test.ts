import { generateCode } from '../src';

test('generates code using babel ASTs', () => {
    const input = {
        "Pools": {
            "requestType": "QueryPoolsRequest",
            "responseType": "QueryPoolsResponse"
        }
    };

    const queryInterface = 'UsePoolsQuery<TData>';
    const hookName = 'usePools';
    const requestType = input.Pools.requestType;
    const responseType = input.Pools.responseType;
    const queryServiceMethodName = 'queryService.pools';
    const keyName = 'poolsQuery';

    const resultingCode = generateCode(
        queryInterface,
        hookName,
        requestType,
        responseType,
        queryServiceMethodName,
        keyName
    );

    expect(resultingCode).toMatchSnapshot();
});
