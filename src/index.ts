


import { transformFromAstSync } from '@babel/core';
import * as t from '@babel/types';

export function generateCode(
    queryInterface: string,
    hookName: string,
    requestType: string,
    responseType: string,
    queryServiceMethodName: string,
    keyName: string
): string {
    const ast = t.file(
        t.program([
            t.exportNamedDeclaration(
                t.tsInterfaceDeclaration(
                    t.identifier(queryInterface),
                    null,
                    null,
                    t.tsInterfaceBody([
                        t.tsPropertySignature(
                            t.identifier('propertyName'),
                            t.tsTypeAnnotation(
                                t.tsTypeReference(
                                    t.identifier('TypeName')
                                )
                            )
                        )
                    ])
                )
            ),
            t.variableDeclaration(
                'const',
                [
                    t.variableDeclarator(
                        t.identifier(hookName),
                        t.arrowFunctionExpression(
                            [
                                t.objectPattern([
                                    t.objectProperty(
                                        t.identifier('request'),
                                        t.identifier('request'),
                                        false,
                                        true
                                    ),
                                    t.objectProperty(
                                        t.identifier('options'),
                                        t.identifier('options'),
                                        false,
                                        true
                                    )
                                ])
                            ],
                            t.blockStatement([
                                t.returnStatement(
                                    t.callExpression(
                                        t.identifier('useQuery'),
                                        [
                                            t.arrayExpression([
                                                t.stringLiteral(keyName),
                                                t.identifier('request')
                                            ]),
                                            t.arrowFunctionExpression(
                                                [],
                                                t.blockStatement([
                                                    t.ifStatement(
                                                        t.unaryExpression(
                                                            '!',
                                                            t.identifier('queryService'),
                                                            true
                                                        ),
                                                        t.blockStatement([
                                                            t.throwStatement(
                                                                t.newExpression(
                                                                    t.identifier('Error'),
                                                                    [
                                                                        t.stringLiteral('Query Service not initialized')
                                                                    ]
                                                                )
                                                            )
                                                        ]),
                                                        null
                                                    ),
                                                    t.returnStatement(
                                                        t.callExpression(
                                                            t.memberExpression(
                                                                t.identifier('queryService'),
                                                                t.identifier(queryServiceMethodName),
                                                                false
                                                            ),
                                                            [
                                                                t.identifier('request')
                                                            ]
                                                        )
                                                    )
                                                ]),
                                                false
                                            )
                                        ]
                                    )
                                )
                            ])
                        )
                    )
                ]
            )
        ])
    );

    const { code } = transformFromAstSync(ast, null, {
        presets: ['@babel/preset-env', '@babel/preset-typescript'],
        configFile: false,
        filename: 'file.ts'
    });

    return code;
}