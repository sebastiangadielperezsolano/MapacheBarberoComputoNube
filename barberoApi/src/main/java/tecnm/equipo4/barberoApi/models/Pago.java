package tecnm.equipo4.barberoApi.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "pago")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idPago")
    private Long idPago;

    @Column(name = "montoTotal", precision = 10, scale = 2)
    private BigDecimal montoTotal;

    @Column(name = "metodo")
    private String metodo;

    @Column(name = "estado")
    private String estado;

    @Column(name = "ultimosDigitos", length = 4)
    private String ultimosDigitos;

    @OneToOne
    @JoinColumn(name = "idTurno", nullable = false, unique = true)
    private Turno turno;


}