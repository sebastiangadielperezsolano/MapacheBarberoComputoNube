package tecnm.equipo4.barberoApi.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor

@Table(name = "pago")
public class Pago {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idPago")
    private Long idPago;

    @NotNull
    @Column(name = "montoTotal")
    @Digits(integer = 6, fraction = 2)
    private BigDecimal montoTotal;

    @NotNull
    @Column(name = "metodo")
    private String metodo;

    @NotNull
    @Column(name = "estado")
    private String estado;

    @NotNull
    @Column(name = "ultimosDigitos")
    @Digits(integer = 4, fraction = 0)
    private String ultimosDigitos;

    @OneToOne
    @JoinColumn(name = "idTurno")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Turno turno;
}