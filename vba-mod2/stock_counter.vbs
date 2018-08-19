Sub StockCount():
    Dim last As Double
    Dim vol As Double
    Dim x As Integer
    Dim op As Double    'opening stock
    Dim cl As Double    'closing stock
    
    For Each ws In Worksheets
        vol = 0
        x = 2
        op = ws.Cells(2, 6).Value   'grab opening stock
        last = ws.Cells(Rows.Count, 1).End(xlUp).Row
    
        ws.Cells(1, 9).Value = "Ticker"
        ws.Cells(1, 10).Value = "Yearly Change"
        ws.Cells(1, 11).Value = "Percent Change"
        ws.Cells(1, 12).Value = "Total Stock Volume"
        
        For i = 2 To last
            If ws.Cells(i, 1).Value <> ws.Cells(i + 1, 1).Value Then
                tick = ws.Cells(i, 1).Value         'grab ticker
                vol = vol + ws.Cells(i, 7).Value    'grab stock volume
                cl = ws.Cells(i, 3).Value           'grab closing stock
                
                ws.Cells(x, 9).Value = tick
                ws.Cells(x, 12).Value = vol
                ws.Cells(x, 10).Value = op - cl
                ws.Cells(x, 10).NumberFormat = "0.000000000"
                
                If (op - cl) > 0 Then
                    ws.Cells(x, 10).Interior.ColorIndex = 4
                Else
                    ws.Cells(x, 10).Interior.ColorIndex = 3
                End If

                'calculate percent difference, DIV/0 case
                If op <> 0 Then
                    ws.Cells(x, 11).Value = (op - cl) / op
                    ws.Cells(x, 11).NumberFormat = "0.00%"
                Else
                    ws.Cells(x, 11).Value = 0
                    ws.Cells(x, 11).NumberFormat = "0.00%"
                End If
                'move to next ticker
                x = x + 1
                vol = 0
                op = ws.Cells(i + 1, 6).Value
            Else
                'assign to same ticker
                vol = vol + ws.Cells(i, 7).Value
            End If
        Next i
        
        ws.Cells(1, 15).Value = "Ticker"
        ws.Cells(1, 16).Value = "Value"
        
        ws.Cells(2, 14).Value = "Greatest % Increase"
        ws.Cells(3, 14).Value = "Greatest % Decrease"
        ws.Cells(4, 14).Value = "Greatest Total Volume"
        
        ws.Cells(2, 16).Value = Application.WorksheetFunction.Max(ws.Columns("K"))
        ws.Cells(3, 16).Value = Application.WorksheetFunction.Min(ws.Columns("K"))
        ws.Cells(4, 16).Value = Application.WorksheetFunction.Max(ws.Columns("L"))
        
        For i = 2 To last
            If ws.Cells(i, 11).Value = ws.Cells(2, 16).Value Then
                ws.Cells(2, 15).Value = ws.Cells(i, 9).Value
            ElseIf ws.Cells(i, 11).Value = ws.Cells(3, 16).Value Then
                ws.Cells(3, 15).Value = ws.Cells(i, 9).Value
            ElseIf ws.Cells(i, 12).Value = ws.Cells(4, 16).Value Then
                ws.Cells(4, 15).Value = ws.Cells(i, 9).Value
            End If
        Next i
        
        ws.Cells(2, 16).NumberFormat = "0.00%"
        ws.Cells(3, 16).NumberFormat = "0.00%"
        
    Next ws
End Sub